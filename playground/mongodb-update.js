// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
    (err, client) => {

        if (err) return console.log('Unable to connect to MongoDB server');

        console.log('Connected to MongoDB server !');

        let db = client.db('TodoApp');

        // db.collection('Todos').findOneAndUpdate({ _id: new ObjectID('5ab02ae1367139301c2236fc') }, {
        //         $set: {
        //             completed: true,
        //         }
        //     }, {

        //         returnOriginal: false,

        //     })
        //     .then(result => console.log(result))
        //     .catch(err => console.log('Unable to update colledtion'));

        db.collection('Users').findOneAndUpdate({ _id: new ObjectID('5ab02504f11ea34e983aa2a4') }, {
                $set: { name: 'Martial Anouman' },
                $inc: { age: 10 },
            }, {
                returnOriginal: false,
            }).then(result => console.log(result))
            .catch(err => console.log('Unable to update collection'));


    });