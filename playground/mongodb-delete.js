// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',
    (err, client) => {

        if (err) return console.log('Unable to connect to MongoDB server');

        console.log('Connected to MongoDB server !');

        let db = client.db('TodoApp');

        // deleteMany

        db.collection('Users').deleteMany({ name: 'Martial Anouman' })
            .then((result) => console.log(`Number of docs deleted : ${result.deletedCount}`))
            .catch((err) => console.log('Unable to delete users.'));

        // deleteOne


        // findOneAndDelete

        db.collection('Users').findOneAndDelete({ _id: new ObjectID('5ab026931d140d0158cdeb49') })
            .then((doc) => console.log(`User deleted : ${doc.value.name}`))
            .catch((err) => console.log('Unable to find or delete user.'));

    });