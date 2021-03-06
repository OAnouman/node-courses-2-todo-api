//#region Imports

// ENV import

require('./config/config');

// Globals imports

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const _ = require('lodash');

// Local imports

require('./db/mongoose');

const { ObjectID } = require('mongodb');

const { Todo } = require('./models/Todo');

const { User } = require('./models/User');

const { authenticate } = require('./middleware/authenticate');

//#endregion

let port = process.env.PORT;

//#region Middleware

app.use(bodyParser.json());

//#endregion



//#region API routes

//#region Todo routes

app.post('/todos', authenticate, (req, res, next) => {

    let todo = new Todo({

        text: req.body.text,

        _creator: req.user._id,

    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(e =>
            res.status(400).send(`Unable to create todo. Error details : ${e}`));

});

app.get('/todos', authenticate, (req, res, next) => {

    Todo.find({

        _creator: req.user._id

    }).then(todos => {

        res.send({ todos });

    }).catch(e =>
        res.status(400).send(`Unable to create todo. Error details : ${e}`));

});

// Get todo by id route

app.get('/todos/:id', authenticate, (req, res, next) => {

    let id = req.params.id;

    // Validate ID 

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);

    Todo.findOne({

            _id: id,

            _creator: req.user._id,

        })
        .then(todo => {

            if (!todo)

                return Promise.reject();

            res.send({ todo });

        })
        .catch(e => {

            res.sendStatus(404);

        });


});


// Delete todo route

app.delete('/todos/:id', authenticate, (req, res, next) => {

    let id = req.params.id;

    // Validate ID 

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);

    Todo.findOneAndRemove({
            _id: id,

            _creator: req.user._id,
        })
        .then(todo => {

            if (!todo)

                res.status(404).send('No todo match  the given id.');

            res.send({ todo });
        })
        .catch(error => {

            res.sendStatus(400);

        });


});

app.patch('/todos/:id', authenticate, (req, res, next) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);


    if (_.isBoolean(body.completed) && body.completed) {

        body.completedAt = new Date().getTime();

    } else {

        body.completed = false;

        body.completedAt = null;

    }

    Todo.findOneAndUpdate({

            _id: id,

            _creator: req.user._id,

        }, { $set: body }, { new: true })
        .then(todo => {

            if (!todo)

                res.sendStatus(404);

            res.send({ todo });

        })
        .catch(e => res.status(400).send({ e }));


});
//#endregion

//#region User routes

app.post('/users', (req, res, next) => {

    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    user.save()
        .then(() => {

            return user.generateAuthToken();

        })
        .then(token => {

            res.header('x-auth', token)
                .send({ user });

        })
        .catch(e => res.status(400).send({ e }));

})



app.get('/users/me', authenticate, (req, res, next) => {

    let token = req.header('x-auth');

    User.findByToken(token)
        .then(user => {

            if (!user) {

                return Promise.reject();

            }

            res.send({ user });

        })
        .catch(e => {
            res.sendStatus(401);
        });

});


app.post('/users/login', (req, res, next) => {


    let credentials = _.pick(req.body, ['email', 'password']);


    User.findByCredentials(credentials)
        .then(user => {

            return user.generateAuthToken()
                .then(token => {

                    res.header('x-auth', token).send({ user });

                });

        })
        .catch(e => res.sendStatus(404));

});

app.delete('/users/me/token', authenticate, (req, res, next) => {

    let user = req.user;

    user.removeToken(req.token)
        .then(() => {

            res.sendStatus(200);

        })
        .catch(e => res.sendStatus(400));

});

//#endregion

//#endregion

app.listen(port, () => console.log(`Server up and running on port ${port}...`));

module.exports = { app };