const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('./authenticate-middleware')
const secrets = require('../config/secrets');

router.get('/users', restricted, (req, res) => {
  Users.find()
  .then(response => {
    res.status(200).json(response);
  })
  .catch(error => {
    res.status(500).json({message: 'Error getting users'})
  })
})

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
      res.status(500).json({message: 'Error registering user'})
  })
});

router.post('/login', (req, res) => {
  let { username, password} = req.body;
  Users.findBy({ username }).first()
  .then(user => {
      if (user && bcrypt.compareSync(password, user.password)){
          const token = generateToken(user);
          res.status(200).json({message: `Welcome, ${user.username}`, token});
      } else {
          res.status(401).json({message: 'Invalid username and/or password'})
      }
  })
  .catch(err => {
      res.status(500).json({message: 'Error finding user'})
  })});

function generateToken(user){
  const payload = {
      username: user.username,
      department: user.department
  }
  const options = {
      expiresIn: '8h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
