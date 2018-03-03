const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');// requiring server.js
const {Todo} = require('./../models/todo.js'); // requiring todo.js to make be sure DB is filled


// POST /todos ROUTE TEST

// beforeEach - func that makes sure that some conditions are met before the test starts
beforeEach((done) => {// it will be called before the test case and will start the test after done is called
    Todo.remove({}).then(() => done());// empty DB before test
            //because we assume bellow that DB is empty, its not atm rip in pepperoni
});


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
                Todo.find().then((todos) => { // find data
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
                    expect(todos.length).toBe(0);//we expect 0 because this code does not create a thing
                    done();
                }).catch((e) => done(e));
            })

    });
});