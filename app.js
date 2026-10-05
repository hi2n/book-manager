require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
app.set('trust proxy', 1);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));

// ===== SESSION (nhánh feature/session viết vào đây) =====

const session = require('express-session');
const { MongoStore } = require('connect-mongo');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_WRITE_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  if (req.path === '/favicon.ico' || req.path === '/health') return next();
  req.session.visits = (req.session.visits || 0) + 1;
  res.locals.visits = req.session.visits;
  next();
});

app.get('/session-test', (req, res) => {
  res.send(`Số lần truy cập (lưu trên Atlas): ${req.session.visits}`);
});

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
