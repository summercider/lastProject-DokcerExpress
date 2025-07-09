const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// DB 연결
const db = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
}).promise();

// API 라우트
app.get('/users', async (req, res) => {
const [rows] = await db.query('SELECT \* FROM users');
res.json(rows);
});

app.post('/users', async (req, res) => {
const { name, email } = req.body;
await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
res.send('User added');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
