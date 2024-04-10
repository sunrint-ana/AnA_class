const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const uploadRouter = require('./routes/upload');
const postRouter = require('./routes/post');
const moment = require('moment')

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'db'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/public', express.static(__dirname + '/public', { 'extensions': ['html', 'css', 'js'] }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const sql = 'SELECT post_title, post_content, post_date, filename FROM blogPosts';
  const dateFormat = 'YYYY-MM-DD';

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).render('index.ejs', { error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    } else {
      const formattedData = results.map(row => {
        return {
          post_title: row.post_title,
          post_content: row.post_content,
          post_date: moment(row.post_date).format(dateFormat),
          filename: row.filename
        };
      });

      res.render('index.ejs', { posts: formattedData});
    }
  });
});

app.use('/upload', uploadRouter);
app.use('/post', postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
