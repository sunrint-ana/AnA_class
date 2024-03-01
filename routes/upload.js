const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'db'
});

connection.connect();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5,
  },
});

router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const filename = req.file.filename;
  const data = fs.readFileSync(filePath);
  const postContent = req.body.post_content;
  const postDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const postTitle = req.body.post_title;

  const sql = 'INSERT INTO blogPosts (filename, data, post_content, post_date, post_title) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [filename, data, postContent, postDate, postTitle], (error, results, fields) => {
      if (error) {
          console.error(error);
          res.status(500).send('파일 업로드 중 오류가 발생했습니다.');
      } else {
          res.send('파일 업로드가 성공했습니다.');
      }
  });
});

router.get('/', (req, res) => {
    res.render('upload.ejs');
  });

module.exports = router;