// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
    (err, client) => {

        if (err) return console.log('Unable to connect to MongoDB server');

        console.log('Connected to MongoDB server !');

        let db = client.db('TodoApp');

        // Reading code

        // db.collection('Todos').find().count().then((count) => {
        //     console.log(`Todos count : ${count}`);
        //     client.close();
        // }).catch((err) => {
        //     console.log('Unable ti fetch docs', err);
        // });

        db.collection('Users').find({ name: 'Martial' }).toArray()
            .then((users) => {

                console.log(JSON.stringify(users, undefined, 2));

            }).catch((err) => {
                console.log('Unable to fetch users', err);
            });

    });