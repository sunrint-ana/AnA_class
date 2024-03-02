const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'db'
});

router.get('/', (req, res) => {
  res.render('login.ejs');
});

router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

module.exports = router;

router.post('/authenticate', (req, res) => {
  const { user_id, password } = req.body;

  connection.query('SELECT * FROM userTable WHERE user_id = ? AND password = ?', [user_id, password], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send('Database error');
    } else {
      if (results.length > 0) {
        req.session.isLoggedIn = true;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});
