var mongoose = require('mongoose');


// mongoose config
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// mongoose model for Todo
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true // removes white space
    },
    completed: {
        type: Boolean,
        default: false // default value
    },
    completedAt: {
        type: Number,
        default: null
    }
});


// // 1st
// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved Todo',doc)
// }, (e) => {
//     console.log('Unable to save Todo');
// });


// // 2nd
// var secondTodo = new Todo({
//     text: true
// });
// secondTodo.save().then((res) => {
//     console.log(JSON.stringify(res, undefined, 2));
// }, (e)=> {
//     console.log('error', e);
// });




// User model
// email property - required, trimmed, type(string), min length 1

var User = mongoose.model('User', {
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    }
});
var newUser = new User({
    email: ''
});
newUser.save().then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
}, (e) => {
    console.log('error', e);
});