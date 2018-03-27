const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString)
    .then(moongose => {})
    .catch(e => console.log(JSON.stringify(e, undefined, 2)));

module.exports = {

    mongoose,

};