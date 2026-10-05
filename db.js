const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    code: String,
    title: String,
    author: String,
    price: Number,         // giá gốc
    vat: Number,           // % VAT đã áp dụng
    priceAfterTax: Number, // giá sau thuế
  },
  { timestamps: true }
);

// User bị giới hạn quyền nên tắt tự tạo index/collection
const opts = { autoIndex: false, autoCreate: false };

const readConn = mongoose.createConnection(process.env.MONGO_READ_URI, opts);
const writeConn = mongoose.createConnection(process.env.MONGO_WRITE_URI, opts);

readConn.on('connected', () => console.log('READ connection OK (reader)'));
writeConn.on('connected', () => console.log('WRITE connection OK (writer)'));
readConn.on('error', (e) => console.error('READ error:', e.message));
writeConn.on('error', (e) => console.error('WRITE error:', e.message));

module.exports = {
  BookRead: readConn.model('Book', bookSchema, 'books'),   // chỉ dùng để đọc
  BookWrite: writeConn.model('Book', bookSchema, 'books'), // chỉ dùng để ghi
};