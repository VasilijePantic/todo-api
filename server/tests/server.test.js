const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');// requiring server.js
const {Todo} = require('./../models/todo.js'); // requiring todo.js to make be sure DB is filled
const {User} = require('./../models/user')

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



// beforeEach - func that makes sure that some conditions are met before the test starts
beforeEach(populateUsers);
beforeEach(populateTodos);// from seed.js


// DESCRIBE BLOCK FOR POST /todos
describe('POST /todos', () => {
    // 1st test case
    it('should create a new todo', (done) => { // async test
        var text = 'Test todo text'; // this is just to check if everything went aight

        request(app)// supertest the app
            .post('/todos') // on POST request on /todos route
            .set('x-auth', users[0].tokens[0].token)
            .send({text})//to make a POST req test work-we need to send something,in this case its some text
            .expect(200)//we expect res to be 200 OK
            .expect((res) => {
                expect(res.body.text).toBe(text);//we expect that text var will be in res.body.text
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                // we need to check if DB got the data
                Todo.find({text}).then((todos) => { // find data
                    expect(todos.length).toBe(1); // expect it to have 1 in this case
                    expect(todos[0].text).toBe(text);// expect that data to be var text
                    done(); // then call done
                }).catch((e) => done(e)); // catch will get err and will pass it into done
            });
    });

    // 2nd test case - to test what happens if we pass invalid data
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({}) // pass empty obj to send
            .expect(400) // we expect 400 if error like in server.js
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);//we expect 2 - dummy todo seeds
                    done();
                }).catch((e) => done(e));
            })

    });
});



// DESCRIBE BLOCK FOR GET /todos
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {  // we expect something about the body of the response
                expect(res.body.todos.length).toBe(1)
            })  
            .end(done);
    });
});

//*********************************************************** */


// DESCRIBE BLOCK FOR GET /todos/:id
describe('GET /todos/:id',() => {

    // test if it returns a todo
    it('should return a todo', (done) => {
        request(app)    // getting the ID from dummy todos array
            .get(`/todos/${todos[0]._id.toHexString()}`)// .toHexString will 'stringify' the ID obj
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {  // the text propery returned should be the same as from dummy todo
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    // 2nd test case - not returning todo
    it('should not return a todo created by other user', (done) => {
        request(app)    // getting the ID from dummy todos array
            .get(`/todos/${todos[1]._id.toHexString()}`)// .toHexString will 'stringify' the ID obj
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });


    // test if todo with that ID exists
    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();// getting string version of the obj ID
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    // test if invalid obj ID
    it('should return 404 for non-obj IDs', (done) => {
        request(app)
            .get('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

//**************************************************************** */


// DESCRIBE BLOCK FOR - DELETE /todos/:id
describe('DELETE /todos/:id', () => {
    
    // 1st test case - should remove a todo and check if removed
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            })
    });


    // 2nd test case - removing another users todo
    it('should not remove a todo created by other user', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            })
    });


    // 3rd test case - return 404 if todo not found
    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();// getting string version of the obj ID
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    // 4th test case - test if ObjectID is valid
    it('should return 404 if objectID is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});


//**************************************************************** */


// DESCRIBE BLOCK FOR - PATCH /todos/:id

describe('PATCH /todos/:id', () => {

    //1st test case - should update a todo- change completed to true
    it('should update a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This is the new text';
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({// send things that are being updated
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                // expect(res.body.todo.completedAt).toBeA('number'); // HACKERMAN ERROR FOUND
            })
            .end(done)
    });

    // 2nd test case
    it('should not update a todo of another user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This is the new text';
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({// send things that are being updated
                completed: true,
                text
            })
            .expect(404)
            .end(done)
    });



    //3rd test case -should clear completedAt when completed is false
    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'SUP NIGGA MA BOI';
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({// send things that are being updated
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
                // expect(res.body.todo.completedAt).toBeA('number'); // HACKERMAN ERROR FOUND
                // toBeA() - not working
            })
            .end(done)
    });
});




//**************************************************************** */


// BLOCK FOR - GET /users/me
describe('GET /users/me', () => {
    
    // 1st test case
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)// setting the header - 2 args - name and value
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });


    // 2nd test case
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});//should be empty obj
            })
            .end(done);
    });
});


//**************************************************************** */


// BLOCK FOR - POST /users
describe('POST /users', () => {

    //1st test case
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);// toNotBe() aint valid anymore
                    done();
                }).catch((e) => done(e));
            });
    });
    
    //2nd test case
    it('should return validation errors if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done);
    });
    
    //3rd test case
    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done);

    });
    
});



// DESCRIBE BLOCK FOR - POST /users/login

describe('POST /users/login', () => {

    //1st test case
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({// instead of .toInclude
                        access: 'auth', // user must be converted toObject()
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });


    //2nd test case
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});


// DESCRIBE BLOCK FOR -DELETE /users/me/token
describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.toObject().tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});