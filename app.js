const express = require('express');
const mysql = require('mysql');
const loginRouter = require('./routes/login');
const uploadRouter = require('./routes/upload');

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

app.use('/public', express.static(__dirname + '/public', { 'extensions': ['html', 'css'] }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signup', (req, res) => {
  const { user_id, password, email } = req.body;
  const newData = {
          user_id: user_id,
          password: password,
          email: email
      };

  
      console.log('newData:', newData);
  
      connection.query('INSERT INTO userTable SET ?', newData, (error, results, fields) => {
          if (error) {
              console.log(error);
              res.status(500).send('Database error');
          } else {
              console.log('New Data added with ID:', results.insertId);
              res.redirect('/login');
          }
      });
  });

app.get('/', (req, res) => {
  const sql = 'SELECT post_title, post_content, post_date, filename FROM blogPosts';
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).render('index.ejs', { error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    } else {
      res.render('index.ejs', { posts: results[0] });
    }
  });
});



app.use('/login', loginRouter);
app.use('/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
