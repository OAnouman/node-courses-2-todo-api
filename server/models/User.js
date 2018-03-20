const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        required: true,

        trim: true,

        type: String,

        minlength: 1
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};