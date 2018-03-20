const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(connectionString);

module.exports = {

    mongoose,

};