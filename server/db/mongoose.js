const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(connectionString);

module.exports = {

    mongoose,

};