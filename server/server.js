//#region Imports

// Globals imports

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

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

app.get('/todos/:id', (req, res, next) => {

    let id = req.params.id;

    // Validate ID 

    if (!ObjectID.isValid(id))

        res.status(400).send(`The given id is not valid `);

    Todo.findById(id)
        .then(todo => {

            if (!todo)

                res.status(404).send('No todo matches the given id.');

            res.status(200).send(todo);
        })
        .catch(e => {

            res.status(400).send(e);

        });


});

//#endregion


app.listen(port, () => console.log(`Server up and running on port ${port}...`));

module.exports = { app };