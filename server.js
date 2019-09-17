const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const Users = require("./users/user-model");
const db = require("./data/db-config");
const restricted = require("./auth/restricted-middleware");

const server = express();

const sessionConfig = {
  name: "tiger",
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //during development false is okay, but production should be true
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false //GDPR compliance
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.get("/", (req, res) => {
  res.send("Hi my name is Neha!");
});

server.post("/api/register", (req, res) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 14);

  Users.add({ username, password: hash })
    .then(saved => {
      console.log(saved);
      res.status(201).json(saved);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error creating user" });
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;
  console.log("login body", req.body);

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You cannot pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = server;
