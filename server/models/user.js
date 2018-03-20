// import { Schema } from 'mongoose'; // sta je ovo ????

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


// User model
// email property - required, trimmed, type(string), min length 1


var UserSchema = new mongoose.Schema({
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
    }
);

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


// basically creating a method that will generate a token with whom we'll be able to later check the user
UserSchema.methods.generateAuthToken = function () {// () => {} cant bind this keyword
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]); // basically concat === push

    return user.save().then(() => {
        return token;
    })
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};