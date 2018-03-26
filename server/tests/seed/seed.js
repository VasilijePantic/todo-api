const {ObjectID} = require('mongodb');

const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

//users dummy array
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
}];


// dummy array for seeding DB wtth todos
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];


const populateTodos = (done) => {// it will be called before the test case and will start the test after done is called
    Todo.remove({}).then(() => {
        Todo.insertMany(todos); // will insert dummy todos in DB
    }).then(() => done());// empty DB before test
            //because we assume bellow that DB is empty, its not atm rip in pepperoni
};


const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};


module.exports = {todos, populateTodos, users, populateUsers};