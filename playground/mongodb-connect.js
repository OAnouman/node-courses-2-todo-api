// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();

// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp',
    (err, client) => {

        if (err) return console.log('Unable to connect to MongoDB server');

        console.log('Connected to MongoDB server !');

        let db = client.db('TodoApp');

        // db.collection('Todos').insertOne({
        //     text: 'Something to do !',
        //     commpleted: false,
        // }, (err, results) => {

        //     if (err) return console.log('Unable to add data to collection.', err);

        //     console.log(JSON.stringify(results.ops, undefined, 2));

        // });

        // db.collection('Users').insertOne({
        //     name: 'Melissa Otchoa',
        //     age: 19,
        //     location: 'Abidjan',
        // }, (err, result) => {

        //     if (err)
        //         return console.log(`Unable to insert data into collection. ${err}`);

        //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));

        // })

        client.close();

    });