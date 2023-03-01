const mongoose = require('mongoose');

async function connect() {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_DB_CONN_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB connected');
  } catch (error) {
    console.log('Cannot connect database:', error);
  }
}

module.exports = connect;
