const { mongoose } = require('./../server/db/mongoose');

const { ObjectID } = require('mongodb');

const { Todo } = require('./../server/models/Todo');

const { User } = require('./../server/models/User');

// Remove 

// Todo.remove({}).then(results => {

//     console.log(results);

// }).catch(e => console.log(e));

Todo.findByIdAndRemove('5ab5675b2098ba7d1c6c79e8')
    .then(todo => {

        console.log(todo);

    }).catch(e => console.log(e));