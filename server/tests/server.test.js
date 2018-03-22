//#region Imports

const expect = require('expect');

const request = require('supertest');

const { app } = require('./../server');

const { Todo } = require('./../models/Todo');

//#endregion

// Dummy data to seed database

const dummyTodos = [

    { text: 'First Test text' },
    { text: 'Second Test text' },
    { text: 'Third Test text' },
    { text: 'Fourth Test text' },
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