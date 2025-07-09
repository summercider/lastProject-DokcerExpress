const express = require('express');
const router = express.Router();
const connection = require('../config/mysql.js');

router.get('/saleitem-btn', (req, res) => {
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
-- LIMIT ? OFFSET ? ;
`;

  const limit = 10;
  const offset = 0;
  const btnValue = req.query.btnValue;
  const btnKey = `%${btnValue}%`;

  connection.query(btnSql, [btnKey, limit, offset], (err, btnResult) => {
    if (err) {
      console.error('sql get 에러' + err.message);
      return res.status(500).send('데이터베이스에서 버튼 필터 api 오류');
    }

    console.log(btnResult);
    return res.json({
      data: btnResult,
    });
  });
});

module.exports = router;
