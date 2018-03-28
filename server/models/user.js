// import { Schema } from 'mongoose'; // sta je ovo ????

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]); // basically concat === push

    return user.save().then(() => {
        return token;
    });
};


// method for token deletion
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {// mongodb operator - lets you remove items from the array that match certain criteria
            tokens: {
                token: token
            }
        }
    })
};




// token auth method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();// literally the same this as above
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};



// /users/login auth method
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    })
};




// bcrypt middleware for hashing passwords 
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {// hashing user.password
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();// this will save hashed password in the DB
            });
        });
    } else {
        next();
    }
});




var User = mongoose.model('User', UserSchema);

module.exports = {User};