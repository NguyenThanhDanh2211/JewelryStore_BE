const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_URI } = process.env;

async function connect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database!!!');
  } catch (error) {
    console.log('Cannot connect to Database!!!', error);
    process.exit();
  }
}

module.exports = { connect };
