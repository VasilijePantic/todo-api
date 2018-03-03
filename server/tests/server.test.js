const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');// requiring server.js
const {Todo} = require('./../models/todo.js'); // requiring todo.js to make be sure DB is filled


// POST /todos ROUTE TEST

// dummy array for seeding DB
const todos = [{
    text: 'First test todo'
}, {
    text: 'Second test todo'
}];



// beforeEach - func that makes sure that some conditions are met before the test starts
beforeEach((done) => {// it will be called before the test case and will start the test after done is called
    Todo.remove({}).then(() => {
        Todo.insertMany(todos); // will insert dummy todos in DB
    }).then(() => done());// empty DB before test
            //because we assume bellow that DB is empty, its not atm rip in pepperoni
});


// DESCRIBE BLOCK FOR POST /todos
describe('POST /todos', () => {
    // 1st test case
    it('should create a new todo', (done) => { // async test
        var text = 'Test todo text'; // this is just to check if everything went aight

        request(app)// supertest the app
            .post('/todos') // on POST request on /todos route
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
            .expect(200)
            .expect((res) => {  // we expect something about the body of the response
                expect(res.body.todos.length).toBe(2)
            })  // we expect that there will be 2 todos in DB because of the dummy seeds
            .end(done);
    });
});