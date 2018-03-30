//#region Imports

const expect = require('expect');

const request = require('supertest');

const { ObjectID } = require('mongodb');

// Local imports

const { app } = require('./../server');

const { Todo } = require('./../models/Todo');

const { User } = require('./../models/User');

const { populateTodo, dummyTodos, dummyUsers, populateUser } = require('./seed/seed');

//#endregion



beforeEach(populateTodo);

beforeEach(populateUser);


describe('POST /todos', () => {

    it('Should create a todo', (done) => {

        let text = 'Test todo test';

        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect(res => {

                expect(res.body)
                    .toInclude({ text })

            })
            .end((err, res) => {

                if (err) return done(err);

                Todo.find({ text })
                    .then(docs => {

                        expect(docs.length).toBe(1);

                        // expect(docs[0].text).toBe(text);

                        done();

                    })
                    .catch(e => done(e));

            });

    });


    it('Should not create todo with empty text data', (done) => {

        let text = '';

        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({ text })
            .expect(400)
            .end((err, res) => {

                if (err) return done(err);

                Todo.find().then(docs => {

                        expect(docs.length).toBe(2);

                        done();

                    })
                    .catch(e => done(e));

            });

    });


    it('Should not create todo with invalid text data', (done) => {

        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {

                if (err) return done(err);

                Todo.find().then(docs => {

                        expect(docs.length).toBe(2);

                        done();

                    })
                    .catch(e => done(e));

            });

    });

});

describe('GET /todos', () => {

    it('Should get one todo', (done) => {

        request(app)
            .get('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {

                expect(res.body.todos.length).toBe(1);

            })
            .end(done);

    });

});


describe('GET /todos/:id', () => {

    it('Should return a valid doc', (done) => {

        let testId = dummyTodos[0]._id;

        request(app)
            .get(`/todos/${testId}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body).toBeAn('object').toNotBe(null);
            })
            .end((err, res) => {

                if (err) done(err);

                let requestedTodo = res.body.todo;

                Todo.findById(testId)
                    .then(todo => {

                        expect(todo._id.toString()).toBe(requestedTodo._id);

                        done();

                    })
                    .catch(err => done(err));

            });

    });

    it('It should not return todo created by an other user', (done) => {

        request(app)
            .get(`/todos/${dummyTodos[0]._id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('Should returns a 404 if todo not found', (done) => {

        request(app)
            .get(`/todos/${new ObjectID()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {

                expect(err).toBe(null);

                done();

            });

    });

    it('Should returns a 400 if id is not valid', (done) => {

        request(app)
            .get(`/todos/12345789`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {

                expect(err).toBe(null);

                done();

            });

    });


});

describe('DELETE /todos/:id', () => {

    it('Should returns deleted todo doc', (done) => {

        let id = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(200)
            .expect(res => {

                expect(res.body.todo._id).toBe(id);

            })
            .end((e, res) => {

                if (e) return done(e);

                Todo.find()
                    .then(todos => {

                        expect(todos.length).toBe(1);

                        done();

                    }).catch(e => done(e));

            })

    });

    it('It should not delete todo created by an other user', (done) => {

        request(app)
            .delete(`/todos/${dummyTodos[0]._id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('It should returns a 404 if todo not found', (done) => {

        let id = new ObjectID();

        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('It should returns 400 if id is not valid', (done) => {

        request(app)
            .delete('/todos/123')
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(400)
            .end(done);

    });

});


describe('PATCH /todos/:id', () => {

    it('Should update todo', (done) => {

        let id = dummyTodos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .send({
                text: 'I was updated',
                completed: true,
            })
            .expect(200)
            .expect(res => {

                expect(res.body.todo.text).toNotBe(dummyTodos[1].text);

                expect(res.body.todo.completed).toBe(true);

                expect(res.body.todo.completedAt).toBeA('number');

            })
            .end(done);

    });

    it('Should not update todo created by an other user', (done) => {

        let id = dummyTodos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({
                text: 'I was updated',
                completed: true,
            })
            .expect(404)
            .end(done);

    });

    it('Should clear completedAt value', (done) => {

        let id = dummyTodos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send({
                text: 'I\'m not yet finished',
                completed: false,
            })
            .expect(200)
            .expect(res => {

                expect(res.body.todo.text).toNotBe(dummyTodos[0].text);

                expect(res.body.todo.completed).toBe(false);

                expect(res.body.todo.completedAt).toNotExist();

            })
            .end(done);

    });


});


describe('POST /users', () => {


    it('Should create a user', (done) => {

        let user = { email: 'digba@example.com', password: '123456789' };

        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect(res => {

                expect(res.body.user.email).toEqual(user.email);

                expect(res.headers['x-auth']).toExist();

                expect(res.body.user._id).toExist();

                expect(res.body.user.email).toEqual(user.email);

            })
            .end((err, res) => {

                if (err) return done(err);

                User.findOne({ email: user.email })
                    .then(user => {

                        expect(user).toExist();

                        done();

                    })

            });

    });

    it('Should cnot create a user if request is invalid', (done) => {

        let user = { email: 'digba@examplecom', password: '12345' };
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end((err, res) => {

                User.find()
                    .then(users => {

                        expect(users.length).toBe(2);

                        done();

                    })

            });

    });

    it('Should not create a user if email is in use', (done) => {

        let user = { email: dummyUsers[0].email, password: '12345' };

        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .end((err, res) => {

                User.find()
                    .then(users => {

                        expect(users.length).toBe(2);

                        done();

                    })
                    .catch(e => done(e));

            });

    });

});

describe('GET /users/me', () => {

    it('Should return a 401 if not authenticated', (done) => {

        request(app)
            .get('/users/me')
            .expect(401)
            .end(done);

    });

    it('Should return a user if authenticated', (done) => {

        let token = dummyUsers[0].tokens[0].token;

        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect(res => {

                expect(res.body.user._id).toBe(dummyUsers[0]._id.toHexString());

                expect(res.body.user.email).toBe(dummyUsers[0].email);

            })
            .end(done);


    });

});

describe('POST /users/login', () => {

    it('Should return a user and auth token', (done) => {

        let user = dummyUsers[0];

        request(app)
            .post('/users/login')
            .send(user)
            .expect(200)
            .expect(res => {

                expect(res.headers['x-auth']).toExist();

                expect(res.body.user._id).toEqual(user._id);

                expect(res.body.user.email).toEqual(user.email);

            })
            .end(done);

    });

    it('Should reject login when creds are invalids', (done) => {

        let user = { email: 'test@example.com', password: '123456789' };

        request(app)
            .post('/users/login')
            .expect(404)
            .expect(res => {

                expect(res.headers['x-auth']).toNotExist();

            })
            .end(done);

    });

});


describe('DELETE /users/me/token', () => {

    it('Should remove auth token on logout', (done) => {

        let user = dummyUsers[0];

        request(app)
            .delete('/users/me/token')
            .set('x-auth', user.tokens[0].token)
            .expect(200)
            .end((err, res) => {

                if (err) return done(err);

                User.findById(user._id)
                    .then(user => {

                        expect(user).toExist();

                        expect(user.tokens.length).toBe(0);

                        done();

                    })
                    .catch(e => done(e));

            })

    });

})