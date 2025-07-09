// 1. 모듈 import
const express = require('express');
const router = express.Router();
// Db connection
const connection = require('../config/mysql.js');

/**
 * 라우터 설정
 *
 * 1. 모듈import ( express , express.Router , connection)
 * 2. Db connection
 * !! app.js 에 작성했는데.. 이걸 불러오면 순환참조 오류  app<->saleitem  이걸 막으려면
 *
 * 3. api쿼리
 * 4. export
 * 5. app.js 에서 작성 라우터 사용
 *
 */

// 페이징처리 참고 +
// // LIMIT, OFFSET
// router.get('/vod', (req, res) => {
//   const page = parseInt(req.query.page);
//   let offset = 10;
//   offset = limit * (page - 1);

// });

// 초기데이터 GET
router.get('/saleitem', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  console.log(page);
  const limit = 10;
  const offset = (page - 1) * limit;
  const { btnValue, inpValue } = req.query;
  console.log(btnValue, inpValue);
  const btnKey = `%${btnValue}%`;
  const inpKey = `%${inpValue}%`;

  // 초기 페이지네이션 데이터
  const countPageSql = `
SELECT COUNT(*) AS total 
FROM tb_saleitem_price AS p
JOIN tb_saleitem AS i
ON p.Sales_Code = i.Sales_Code
WHERE i.Place_Code = "001"
AND p.Age_From >= 19;
    `;
  // 초기 리스트 데이터
  const initListSql = `
SELECT 
    i.Sales_Code,
    i.Sales_Item_Name,
    i.Place_Code,
    i.Lesson_ID,
    i.Use_Week,
    i.Start_Time,
    p.Age_From,
    p.Age_To,
    p.Month_Qty,
    p.Unit_Price,
    i.Capacity,
    i.Lottery_Yn,
    i.OnLine_YN
FROM tb_saleitem_price AS p
JOIN tb_saleitem AS i 
ON p.Sales_Code = i.Sales_Code
WHERE i.Place_Code = "001"
AND p.Age_From >= 19 
LIMIT ? OFFSET ? ;
    `;

  // inp 데이터
  const inpSql = `SELECT DISTINCT
    i.Sales_Code,
    i.Sales_Item_Name,
    i.Place_Code,
    i.Lesson_ID,
    i.Use_Week,
    i.Start_Time,
    p.Age_From,
    p.Age_To,
    p.Month_Qty,
    p.Unit_Price,
    i.Capacity,
    i.Lottery_Yn,
    i.OnLine_YN
FROM tb_saleitem_price AS p
JOIN tb_saleitem AS i 
ON p.Sales_Code = i.Sales_Code
WHERE i.Sales_Item_Name LIKE ?
ORDER BY i.Sales_Item_Name ASC, p.Unit_Price ASC
LIMIT ? OFFSET ? ;
`;
  // btn 데이터
  const btnSql = `
SELECT DISTINCT
    i.Sales_Code,
    i.Sales_Item_Name,
    i.Place_Code,
    i.Lesson_ID,
    i.Use_Week,
    i.Start_Time,
    p.Age_From,
    p.Age_To,
    p.Month_Qty,
    p.Unit_Price,
    i.Capacity,
    i.Lottery_Yn,
    i.OnLine_YN
FROM tb_saleitem_price AS p
JOIN tb_saleitem AS i 
ON p.Sales_Code = i.Sales_Code
WHERE i.Sales_Item_Name LIKE ?
ORDER BY i.Sales_Item_Name ASC, p.Unit_Price ASC
LIMIT ? OFFSET ? ;
`;

  const countFilterPageSql = `
SELECT COUNT(DISTINCT i.Sales_Code) AS total
FROM tb_saleitem_price AS p
JOIN tb_saleitem AS i ON p.Sales_Code = i.Sales_Code
WHERE i.Sales_Item_Name LIKE ?

`;

  // -------------------

  // 검색
  if (inpValue) {
    connection.query(countFilterPageSql, [inpKey], (err, pageResult) => {
      {
        if (err) {
          console.error('sql get 에러' + err.message);
          return res
            .status(500)
            .send('데이터베이스에서 페이지네이션 데이터 못가져옴ㅋ');
        }
        const total = pageResult[0].total;

        connection.query(inpSql, [inpKey, limit, offset], (err, inpResult) => {
          if (err) {
            console.error('inp sql 에러', err.message);
            return res.status(500).send('버튼 필터 데이터 못가져옴');
          }

          res.json({
            total, //데이터 전체개수
            data: inpResult,
          });
        });
      }
    });
  } else if (btnValue) {
    // 버튼
    connection.query(countFilterPageSql, [btnKey], (err, pageResult) => {
      {
        if (err) {
          console.error('sql get 에러' + err.message);
          return res
            .status(500)
            .send('데이터베이스에서 페이지네이션 데이터 못가져옴ㅋ');
        }
        const total = pageResult[0].total;

        connection.query(btnSql, [btnKey, limit, offset], (err, btnResult) => {
          if (err) {
            console.error('btn sql 에러', err.message);
            return res.status(500).send('버튼 필터 데이터 못가져옴');
          }

          res.json({
            total, //데이터 전체개수
            data: btnResult,
          });
        });
      }
    });
  } else {
    //초기
    connection.query(countPageSql, (err, pageResult) => {
      {
        if (err) {
          console.error('sql get 에러' + err.message);
          return res
            .status(500)
            .send('데이터베이스에서 페이지네이션 데이터 못가져옴ㅋ');
        }
        const total = pageResult[0].total;

        connection.query(initListSql, [limit, offset], (err, listResult) => {
          if (err) {
            console.error('sql get 에러' + err.message);
            return res
              .status(500)
              .send('데이터베이스에서 초기리스트데이터 못가져옴ㅋ');
          }

          res.json({
            total, //데이터 전체개수
            data: listResult,
          });
        });
      }
    });
  }
});

module.exports = router;
