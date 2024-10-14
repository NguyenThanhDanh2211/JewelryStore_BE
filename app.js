const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');

require('dotenv').config();

const route = require('./src/routes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: crypto.randomBytes(20).toString('hex'),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./src/utils/passport');

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Jewelry Store.' });
});

route(app);

// const used = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`Memory Usage: ${used} MB`);

module.exports = app;
