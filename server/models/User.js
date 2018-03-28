//#region Imports 

const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const _ = require('lodash');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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

    // References a single user doc

    let user = this;

    let access = 'auth';

    let token = jwt.sign({ _id: user._id.toHexString(), access }, '123abc').toString();

    user.tokens.push({ access, token });

    return user.save()
        .then(() => token);

};

UserSchema.pre('save', function(next) {

    let user = this;

    if (user.isModified('password')) {

        bcrypt.genSalt(10)
            .then(salt => {

                bcrypt.hash(user.password, salt)
                    .then(hash => {

                        user.password = hash;

                        next();

                    });

            })
            .catch(e => {});

    } else {
        next();
    }

});

UserSchema.statics.findByToken = function(token) {

    // References the User model

    let User = this;

    let decoded;

    try {

        decoded = jwt.verify(token, '123abc');

    } catch (e) {

        return Promise.reject();

    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });

};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};