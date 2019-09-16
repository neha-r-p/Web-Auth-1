const bcrypt = require('bcryptjs')

const Users = require('../users/user-model')

module.exports = (req, res, next) => {
  let {username, password} = req.headers;

  Users.findBy({ username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)){
        next();
      } else {
        res.status(401).json({ error: "You shall not pass!" })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not find account" })
    })
}

function fetch() {
  const reqOptions = {
    headers: {
      username: "",
      password: ""
    }
  }
}