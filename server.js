const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;

// Connect DB
const db = require('./src/config/db/index');
db.connect();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Jewelry Store.' });
});

app.listen(PORT, () => console.log(`App listen at http://localhost:${PORT}`));
