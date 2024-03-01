const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'db'
});

connection.connect();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 업로드된 파일 저장 경로
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // 파일명 중복 방지를 위한 파일 이름 설정
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  const { postContent } = req.body;
  const imageUrl = req.file ? path.join('uploads', req.file.filename) : null;

  // MySQL에 데이터 저장
  const insertQuery = 'INSERT INTO blogPosts (post_content, image_url) VALUES (?, ?)';
  connection.query(insertQuery, [postContent, imageUrl], (error, results) => {
    if (error) throw error;
    res.redirect('/');
  });
});

router.get('/', (req, res) => {
    res.render('upload.ejs'); // login.ejs 파일을 렌더링
  });

router.get('/post', (req, res) => {
    res.render('post.ejs');
  });

module.exports = router;