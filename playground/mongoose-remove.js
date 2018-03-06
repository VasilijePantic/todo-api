
// MONGOOSE SEARCH/QUERIES METHODS

const {ObjectID} = require('mongodb'); // use this to compare ids
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

// for challange purpouses
const {User} = require('./../server/models/user.js');

// DELETE METHODS

// Todo.remove()

// Todo.remove({}).then((result) => { // remove({})- removes everything // remove() - removes shieeet
//     console.log(result);
// });

// we get the data back but it removes it
// Todo.findOneAndRemove()

Todo.findByIdAndRemove('5a9ddbd2c537ca2825b1119e').then((todo) => {
    console.log(todo);
});

Todo.findOneAndRemove('5a9ddbd2c537ca2825b1119e').then((todo) => {
    console.log('blablabla')
})