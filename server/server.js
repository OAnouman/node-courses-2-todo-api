//#region Imports

// Globals imports

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

// Local imports

const { mongoose } = require('./db/mongoose');

const { Todo } = require('./models/Todo');

const { User } = require('./models/User');

//#endregion

let port = process.PORT || 3000;

//#region Middleware

app.use(bodyParser.json());

//#endregion



//#region API routes

app.post('/todos', (req, res, next) => {

    let todo = new Todo({

            text: req.body.text,

        })
        .save()
        .then(doc => res.status(200).send(doc))
        .catch(e => res.status(400).send(`Unable to create todo. Error details : ${e}`));

})

//#endregion


app.listen(port, () => console.log(`Server up and running on port ${port}...`));