//#region Imports

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

//#endregion

let port = process.env.PORT || 3000;

//#region Middleware

app.use(bodyParser.json());

//#endregion



//#region API routes

app.post('/todos', (req, res, next) => {

    let todo = new Todo({

        text: req.body.text,

    });

    todo.save()
        .then(doc => res.status(200).send(doc))
        .catch(e =>
            res.status(400).send(`Unable to create todo. Error details : ${e}`));

});

app.get('/todos', (req, res, next) => {

    Todo.find().then(todos => {

        res.status(200).send({ todos });

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

            res.status(200).send({ todo });
        })
        .catch(e => {

            res.status(400).send(e);

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

            res.status(200).send({ todo });
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

            res.status(200).send({ todo });

        })
        .catch(e => res.status(400).send({ e }));


});

//#endregion


app.listen(port, () => console.log(`Server up and running on port ${port}...`));

module.exports = { app };