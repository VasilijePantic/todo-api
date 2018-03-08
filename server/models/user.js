const mongoose = require('mongoose');
const validator = require('validator');
// User model
// email property - required, trimmed, type(string), min length 1

var User = mongoose.model('User', {
    
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,//must be the only one existing
        validate: { // validating email -2 args
            validator: validator.isEmail,
            // validator: (value) => { // 1st is validator - func with value
            //     return validator.isEmail(value); // calling validator with .isEmail method
            // },
            message: '{VALUE} is not a valid email'//2nd is - message
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{// array of objects
        access: { // 1st - access
            type: String,
            required: true
        },
        token: { // 2nd - token
            type: String,
            required: true
        }
    }]
});

module.exports = {User};