const http = require('http');
const hostname = '127.0.0.1';
const port = 4000;
const express = require('express');
var router = express.Router();
const app = express();
const server = http.createServer(app);
app.use(express.json());

// Requirements for Sequelize
const { Sequelize, Model, DataTypes } = require('sequelize');
const { User } = require('../models');

// Enforce table names to be the same as model names
const sequelize = new Sequelize('sqlite::memory:', {
  define: { freezeTableName: true}
});


// Check email and password match user submitted data
router.post('/verify', async (req, res) => {
  try { 
    const bodyEmail = req.body.email;
  await User.findOne({where: { email: bodyEmail } }).then (foundUser => { // Check email against database
    if (foundUser !== null) { // If user was found in the database
      if (req.body.password === foundUser.hash) { // If plaintext password hash matches database hash
        // console.log('Database hash matches plaintext password')
        res.status(200).send({message : 'Login successful!', login: true});
      } else { // 
        res.status(401).send({message: 'Username or password incorrect', login: false});
      }
    } else {
      res.status(401).send({message: 'Sorry that user name does not exist', login: false});
    }
  }); } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post('/register', async (req, res) => {
  try {
  const bodyEmail = req.body.email;
  await User.findOne({where: { email: bodyEmail } }).then (foundUser => { // Check email against database
    if (foundUser !== null) { // If user was found in the database
      // console.log('user already exists');
      res.status(401).send({message: "Email already has been registered , please try another", registration: false});
    } else {
      // console.log('DEBUG: email not registered');
    //   requestHash = hashPassword(req.body.password);
      const newUser = User.create({ // Pass info through postman
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          email: req.body.email,
          hash: req.body.password});
        res.status(201).json({id: newUser.id, message: 'New User created!', registration: true});
      }
    }); } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
  });

router.post('/', function(req, res) {
  res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;

// bcrypt - Encrypt Passwords
const bcrypt = require('bcrypt');
// const saltRounds = 10;

// function hashPassword(password) {
//   const hash = bcrypt.hashSync(password, saltRounds);
//   // console.log('Plain text: ', password);
//   // console.log('Hash:', hash);
//   return hash
// }

// function checkPassword(password, hash) {
//   const result = bcrypt.compareSync(password, hash) 
//   // console.log('Password matches hash', result);
//   return result
// }