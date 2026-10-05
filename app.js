require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
app.set('trust proxy', 1);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));

// ===== SESSION (nhánh feature/session viết vào đây) =====



// ===== ROUTES (nhánh feature/database viết vào đây) =====

const cfg = require('./config');
const { listBooks, addBook } = require('./services/bookService');

async function renderHome(req, res, error) {
  res.render('index', {
    books: await listBooks(),
    error,
    prefix: cfg.PREFIX,
    fullName: cfg.FULL_NAME,
    mssv: cfg.MSSV,
    vat: cfg.VAT,
  });
}

app.get('/', (req, res) => renderHome(req, res));

app.post('/books', async (req, res) => {
  try {
    await addBook(req.body);
    res.redirect('/');
  } catch (e) {
    await renderHome(req, res, e.message);
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
