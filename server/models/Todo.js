const mongoose = require('mongoose');

const { ObjectID } = require('mongodb');

const todoSchema = new mongoose.Schema({

    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },

    completedAt: {
        type: Number,
        default: null,
    },

    _creator: {

        type: mongoose.Schema.Types.ObjectId,

        required: true,

        validate: {

            validator: ObjectID.isValid,

            message: '{VALUE} is not a valid ID'

        },

    }

});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = { Todo };