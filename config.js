require('dotenv').config();

const MSSV = process.env.MSSV;

module.exports = {
  MSSV,
  FULL_NAME: process.env.FULL_NAME,
  PREFIX: MSSV.slice(-3),            // 3 ký tự cuối: "074"
  VAT: Number(MSSV.slice(-1)) + 5,   // chữ số cuối + 5: 4 + 5 = 9
};