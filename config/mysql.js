const mysql = require('mysql2'); // DB연결

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,

  multipleStatements: false, //쿼리여러개 허용 반환 []  단,보안 취약 Default:false

  // 커넥션 풀이 가득차면 추가요청을 쌓고 기다림
  waitForConnections: true,
  // 최대 연결 수
  connectionLimit: 10,
  // 커넥션 풀이 가득차도 무제한 대기 허용
  queueLimit: 0,
});

// DB 연결 확인
// createPool엔 connect없어서 주석처리함
// connection.connect((err) => {
//   if (err) {
//     console.error('mysql 연결 실패' + err);
//   } else {
//     console.log(' mysql 연결 성공');
//   }
// });

console.log(' ENV 테스트');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'OK' : 'NO');
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_DATABASE:', process.env.DB_NAME);

module.exports = connection;
