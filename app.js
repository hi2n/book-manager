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

app.get('/health', (req, res) => res.send('ok'));

app.listen(process.env.PORT || 3000, () => console.log('Server running'));