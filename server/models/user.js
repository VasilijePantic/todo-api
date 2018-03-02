var mongoose = require('mongoose');

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

module.exports = {User};