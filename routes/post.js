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
  const isLoggedIn = req.session.isLoggedIn || false;
  const sql = 'SELECT post_title, post_content, post_date, filename FROM blogPosts';
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).render('post.ejs', { error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    } else {
      res.render('post.ejs', { posts: results[0], isLoggedIn });
    }
  });
});

module.exports = router;