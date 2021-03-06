//#region Imports

// Global imports

const { ObjectID } = require('mongodb');

const jwt = require('jsonwebtoken');

// Local imports

const { Todo } = require('./../../models/Todo');

const { User } = require('./../../models/User');


//#endregion

// Dummy data to seed database



let userOneId = new ObjectID();

let userTwoId = new ObjectID();

const dummyUsers = [

    {
        _id: userOneId,
        email: 'manouman@live.fr',
        password: '123456789',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString(),
        }]
    },
    {
        email: 'agilbert@live.fr',
        password: '123456789',
        _id: userTwoId,
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
        }]
    },

];

const dummyTodos = [

    { text: 'First Test text', _id: new ObjectID(), _creator: userOneId },
    { text: 'Fourth Test text', _id: new ObjectID(), completed: true, completedAt: 33333, _creator: userTwoId },

];

// Funtion to seed test DB collection

const populateTodo = (done) => {

    Todo.remove({})
        .then(() => {

            Todo.insertMany(dummyTodos);

            done();

        });

};

const populateUser = (done) => {

    User.remove({})
        .then(() => {

            let userOne = new User(dummyUsers[0]).save();

            let userTwo = new User(dummyUsers[1]).save();

            return Promise.all([userOne, userTwo]);

        }).then(() => {
            done()
        })
        .catch(e => console.log(e));

}


module.exports = {

    populateTodo,

    dummyTodos,

    dummyUsers,

    populateUser,

};