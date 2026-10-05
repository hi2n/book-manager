const { PREFIX, VAT } = require('../config');
const { BookRead, BookWrite } = require('../db');

// Lấy danh sách: dùng tài khoản READ
async function listBooks() {
  return BookRead.find().sort({ createdAt: -1 }).lean();
}

// Thêm sách: kiểm tra, tính thuế, rồi ghi bằng tài khoản WRITE
async function addBook({ code, title, author, price }) {
  code = (code || '').trim();
  price = Number(price);

  // Bộ lọc tiền tố 3 số cuối MSSV
  if (!code.startsWith(PREFIX)) {
    throw new Error(`Mã sách phải bắt đầu bằng "${PREFIX}" (3 số cuối MSSV)`);
  }
  if (!title || Number.isNaN(price) || price < 0) {
    throw new Error('Dữ liệu không hợp lệ');
  }

  // Kiểm tra trùng mã bằng tài khoản READ (tài khoản WRITE không có quyền đọc)
  if (await BookRead.exists({ code })) {
    throw new Error('Mã sách đã tồn tại');
  }

  // VAT động: giá sau thuế = giá gốc x (1 + VAT/100)
  const priceAfterTax = Math.round(price * (1 + VAT / 100));

  return BookWrite.create({ code, title, author, price, vat: VAT, priceAfterTax });
}

module.exports = { listBooks, addBook };