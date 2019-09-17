const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session)

const Users = require("./users/user-model");
const dbConnection = require("./data/db-config");
const restricted = require("./auth/restricted-middleware");

const server = express();

const sessionConfig = {
  name: "chocochip", //would name the cookie sid by default
  secret: process.env.SESSION_SECRET ||'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 60, //in milliseconds
    secure: false, //true means only send cookie over https
    httpOnly: true, //js has no access to the cookie
  },
  resave: false,
  saveUninitialized: true, //GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'knexsessions',

    createtable: true,
    clearInterval: 1000 * 60 * 30, //clean out/expire all session data
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

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
        res.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You cannot pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/logout'), (req, res) => {
  if(req.session){
    req.session.destroy(error => {
      if(error) {
        res.status(500).json({ error: "check out anytime you like but never leave" })
      } else {
        res.status(200).json({ message: "bye" })
      }
    })
  } else {
    res.status(500).json({ error: "already logged out" })
  }
}

module.exports = server;
