
// MONGOOSE SEARCH/QUERIES METHODS

const {ObjectID} = require('mongodb'); // use this to compare ids
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

// for challange purpouses
const {User} = require('./../server/models/user.js');

// var id = '5a9ac7f62c19742ae3e5ffa77';// _id from the 1st dummy todo seed

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// };


// Todo.find({ // .find() - returns an array
//     _id: id // no need to convert it - mongoose does that
// }).then((todos) => {
//     console.log('Todos :', todos);
// });

// Todo.findOne({ // returns a document / obj
//     _id: id // 2nd todo's ID
// }).then((todo) => {
//     console.log('1 Todo :', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('ID not found');
//     }
//     console.log('Todo by ID: ', todo);
// }).catch((e) => console.log(e));


// challange, query Users

var id = '5a99969e3e478748732aff1c'; // nesto nesto

User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));