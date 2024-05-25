const express = require('express');
const cors = require('cors');

const route = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Jewelry Store.' });
});

route(app);

module.exports = app;
