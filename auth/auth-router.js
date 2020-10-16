const db = require("./auth-model"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const secret = require("../config/secrets"); 

const router = require('express').Router();


router.post('/register', validateUser, (req, res) => {
  const { username, password } = req.body; 
  const rounds = process.env.BCRYPT_ROUNDS || 4; 

  db.add({ username, password: bcrypt.hashSync(password, rounds) })
    .then(user => {
      const token = generateToken(user);
      res.status(201).json({ message: `Welcome ${username}`, token }); 
    })
    .catch(error => {
      console.log(error); 
      res.status(500).json({ message: "Error adding new user" });
    })
});


router.post('/login', validateUser, (req, res) => {
  const { username, password } = req.body; 

  db.findBy(username)
    .then(user => {
      if (username && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user); 
        res.status(201).json({ message: `Welcome back ${username}`, token }); 
      } else {
        res.status(403).json({ message: "Incorrect username or password" }); 
      }
    })
    .catch(error => {
      console.log(error); 
      res.status(500).json({ message: "Error logging in" }); 
    })
});

//* authentication user mw *// 
function validateUser(req, res, next){
  const { username, password } = req.body; 

  if (!username || !password) {
    res.status(401).json({ message: "Please provide username and password" }); 
  } else {
    next(); 
  }
}

//* JWT generator*// 
function generateToken(user){
  const payload = {
    id: user.id,
    user: user.username
  }
  const options = {
    expiresIn:'1d'
  }
  return jwt.sign(payload, secret.jwtSecret, options); 
}

module.exports = router;