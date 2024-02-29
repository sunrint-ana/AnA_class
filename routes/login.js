// routes/login.js

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
  res.render('login.ejs'); // login.ejs 파일을 렌더링
});

router.get('/signup', (req, res) => {
  res.render('signup.ejs'); // signup.ejs 파일을 렌더링
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
        // 로그인 성공
        res.redirect('/'); // 로그인 성공 시 홈페이지로 이동
      } else {
        // 로그인 실패
        res.redirect('/login'); // 로그인 실패 시 다시 로그인 페이지로 이동
      }
    }
  });
});
