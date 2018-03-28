//#region Imports

// ENV import

require('./config/config');

// Globals imports

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const _ = require('lodash');

// Local imports

const { mongoose } = require('./db/mongoose');

const { ObjectID } = require('mongodb');

const { Todo } = require('./models/Todo');

const { User } = require('./models/User');

const { authenticate } = require('./middleware/authenticate');

//#endregion

let port = process.env.PORT || 3000;

//#region Middleware

app.use(bodyParser.json());

//#endregion



//#region API routes

//#region Todo routes
app.post('/todos', (req, res, next) => {

    let todo = new Todo({

        text: req.body.text,

    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(e =>
            res.status(400).send(`Unable to create todo. Error details : ${e}`));

});

app.get('/todos', (req, res, next) => {

    Todo.find().then(todos => {

        res.send({ todos });

    }).catch(e =>
        res.status(400).send(`Unable to create todo. Error details : ${e}`));

});

// Get todo by id route

app.get('/todos/:id', (req, res, next) => {

    let id = req.params.id;

    // Validate ID 

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);

    Todo.findById(id)
        .then(todo => {

            if (!todo)

                res.status(404).send('No todo matches the given id.');

            res.send({ todo });
        })
        .catch(e => {

            res.sendStatus(400);

        });


});


// Delete todo route

app.delete('/todos/:id', (req, res, next) => {

    let id = req.params.id;

    // Validate ID 

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);

    Todo.findByIdAndRemove(id)
        .then(todo => {

            if (!todo)

                res.status(404).send('No todo match  the given id.');

            res.send({ todo });
        })
        .catch(error => {

            res.status(400).send({ error });

        });


});

app.patch('/todos/:id', (req, res, next) => {

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

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then(todo => {

            if (!todo)

                res.status(404).send({ error: 'Todo not found' });

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
        .catch(e => res.status(400).send({ e }))


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

//#endregion

//#endregion


app.listen(port, () => console.log(`Server up and running on port ${port}...`));

module.exports = { app };