var mongoose = require('mongoose');

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
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = {Todo};