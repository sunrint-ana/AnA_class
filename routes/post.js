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
    res.render('post.ejs'); // login.ejs 파일을 렌더링
  });

module.exports = router;