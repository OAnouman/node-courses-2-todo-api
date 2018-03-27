//#region Imports 

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const _ = require('lodash');

const validator = require('validator');

//#endregion

const UserSchema = new mongoose.Schema({

    email: {
        required: true,

        trim: true,

        type: String,

        minlength: 1,

        unique: true,

        validate: {

            validator: validator.isEmail,

            messsage: '{VALUE} is not a valid email',

        }
    },

    password: {

        type: String,

        required: true,

        minlength: 6,
    },

    tokens: [{

        access: {

            type: String,

            required: true,

        },

        token: {

            type: String,

            required: true,

        },
    }]
});

UserSchema.methods.toJSON = function() {

    let userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email']);

}

UserSchema.methods.generateAuthToken = function() {

    let user = this;

    let access = 'auth';

    let token = jwt.sign({ _id: user._id.toHexString(), access }, '123abc').toString();

    user.tokens.push({ access, token });

    return user.save()
        .then(() => token);

};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};