//#region Imports

const expect = require('expect');

const request = require('supertest');

const { app } = require('./../server');

const { Todo } = require('./../models/Todo');

const { ObjectID } = require('mongodb');

//#endregion

// Dummy data to seed database

const dummyTodos = [

    { text: 'First Test text', _id: new ObjectID(), },
    { text: 'Second Test text', _id: new ObjectID(), },
    { text: 'Third Test text', _id: new ObjectID(), },
    { text: 'Fourth Test text', _id: new ObjectID(), },

];

beforeEach(done => {

    Todo.remove({})
        .then(() => {

            Todo.insertMany(dummyTodos);

            done();

        });

});


describe('POST /todos', () => {

    it('Should create a todo', (done) => {

        let text = 'Test todo test';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => {

                expect(res.body)
                    .toBeA('object').toInclude({ text })

            })
            .end((err, res) => {

                if (err) return done(err);

                Todo.find({ text })
                    .then(docs => {

                        expect(docs.length).toBe(1);

                        expect(docs[0].text).toBe(text);

                        done();

                    })
                    .catch(e => done(e));

            });

    });


    it('Should not create todo with empty text data', (done) => {

        let text = '';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(400)
            .end((err, res) => {

                if (err) return done(err);

                Todo.find().then(docs => {

                        expect(docs.length).toBe(4);

                        done();

                    })
                    .catch(e => done(e));

            });

    });


    it('Should not create todo with invalid text data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {

                if (err) return done(err);

                Todo.find().then(docs => {

                        expect(docs.length).toBe(4);

                        done();

                    })
                    .catch(e => done(e));

            });

    });

});

describe('GET /todos', () => {

    it('Should get all four todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {

                expect(res.body.todos.length).toBe(4);

            })
            .end(done);

    });

});


describe('GET /todos/id', () => {

    it('Should return a valid doc', (done) => {

        let testId = dummyTodos[0]._id;

        request(app)
            .get(`/todos/${testId}`)
            .expect(200)
            .expect(res => {
                expect(res.body).toBeAn('object').toNotBe(null);
            })
            .end((err, res) => {

                if (err) console.log(err);

                let requestedTodo = res.body;

                Todo.findById(testId)
                    .then(todo => {

                        expect(todo._id.toString()).toBe(requestedTodo._id);

                        done();

                    })
                    .catch(err => console.log(err));

            });

    });

    it('Should returns a 404 if todo not found', (done) => {

        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end((err, res) => {

                expect(err).toBe(null);

                done();

            });

    });

    it('Should returns a 400 id is not valid', (done) => {

        request(app)
            .get(`/todos/12345789`)
            .expect(400)
            .end((err, res) => {

                expect(err).toBe(null);

                done();

            });

    });


});