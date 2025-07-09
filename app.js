// const dotenv = require('dotenv'); // .env파일 연결
// dotenv.config(); //  0. env 활성화

require('dotenv').config();
// ------------------------------------- 다른 모듈 import보다 env먼저해야함 다필요없음 안그럼 undefinded남

// 모듈 import
// 상대경로 귀찮으면 절대경로 package : require('module-alias/register')
const express = require('express');
const cors = require('cors'); //cors허용
const morgan = require('morgan'); //http로깅
const path = require('path'); // public설정path
// 라우터 import
const saleitemInitRouter = require('./routes/saleitem-init');
const saleitemBtnRouter = require('./routes/saleitem-btn');

/**  -이전학습 flow
 *  importing
 *  env
 *  express 객체
 *  포트설정
 *  공통 middleware
 *  라우터
 *  에러처리
 *  서버실행
 */

/**    최우선 env 불러오기 // 0.import
 * 1.express객체생성  // 2.cors허용
 * 3.http로깅        // 4.json파싱
 * 5.쿠키            //  6.세션
 *     + 에러처리, 포트실행
 */
//
// console.log('✔️ ENV 테스트');
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'O' : 'X');
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_DATABASE:', process.env.DB_DATABASE);

const app = express(); // 1. express객체생성
//+미들웨어순차next()실행
app.use(cors()); // 2. 모든 도메인허용
app.set('port', process.env.PORT || 3001); // ex포트설정 ·DB포트 아님 주의
app.use(morgan('dev')); //3. http로깅
app.use('/', express.static(path.join(__dirname, 'public'))); //public 정적폴더 지정
app.use(express.json()); // 4.json파싱
//5. 쿠키
//6. 세션

//+ 라우터
app.use(saleitemInitRouter);
app.use(saleitemBtnRouter);

//+미들에러처리
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

//+서버실행
app.listen(app.get('port'), () => {
  console.log(
    app.get('port'),
    `${app.get('port')}에서 대기중`,
    '!!!!!!!!!!!!!!!! 포트확인 !!!!!!!!!!!!!!!!'
  );
});
