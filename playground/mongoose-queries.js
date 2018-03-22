const { mongoose } = require('./../server/db/mongoose');

const { ObjectID } = require('mongodb');

const { Todo } = require('./../server/models/Todo');

const { User } = require('./../server/models/User');

const ID = '5ab132cf4901d341ac012525';
// const ID = '5ab3ab61ffddb186d4338e0b';


User.findById(ID).then(user => {

        if (!user) return console.log('No match found !');

        console.log('Todo by Id ', user)
    })
    .catch(e => console.log(e));

// Todo.findById(ID).then(todo => {

//         if (!todo) return console.log('No match found !');

//         console.log('Todo by Id ', todo)
//     })
//     .catch(e => console.log(e));