// app.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const loginRouter = require('./routes/login'); // 새로운 라우터 추가
const router = express.Router();

const app = express();
const port = 3000;

// MySQL 연결 설정
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
              res.status(200).send('User registered successfully');
          }
      });
  });

// 루트 경로에서 데이터베이스에서 데이터를 가져와서 EJS로 렌더링
app.get('/', (req, res) => {
  // MySQL에서 데이터 가져오기
  connection.query('SELECT * FROM blogPosts', (err, rows) => {
    if (err) throw err;
    // 데이터를 EJS 템플릿에 전달하여 렌더링
    res.render('index.ejs', { data: rows });
  });
});



app.use('/login', loginRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
