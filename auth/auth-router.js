const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('./authenticate-middleware')


router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
  .then(response => {
      const regToken = generateToken(response);
      response.token = regToken
      res.status(201).json(response);
  })
  .catch(error => {
      res.status(500).json({message: 'error registering user'})
  })
});

router.post('/login', (req, res) => {
  // implement login
});

function generateToken(user){
  const payload = {
      username: user.username,
      department: user.department
  }
  const options = {
      expiresIn: '8h'
  }
  return jwt.sign(payload, 'secretively', options)
}

module.exports = router;
