const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/JewelryStore_dev');
    console.log('Connected to the Database!!!');
  } catch (error) {
    console.log('Cannot connect to the Database!!!', error);
    process.exit();
  }
}

module.exports = { connect };
