const app = require('./app');

require('dotenv').config();

const { API_PORT } = process.env;
const PORT = process.env.PORT || API_PORT;

// Connect DB
const db = require('./src/config/db');
db.connect();

app.listen(PORT, () => console.log(`App listen at http://localhost:${PORT}`));
