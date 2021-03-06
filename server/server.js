require('./config/config.js');


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose.js');// requiring mongoose from ./db/
var {Todo} = require('./models/todo.js');// requiring Todo mongoose model
var {User} = require('./models/user.js');// requiring User mongoose model
var {authenticate} = require('./middleware/authenticate');// requiring middleware

var app = express();
var port = process.env.PORT || 3000;// for heroku

//===================
//       MIDDLEWARE
//===================
app.use(bodyParser.json());

//===================
//     TODOS  ROUTES
//===================

    // /todos POST
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);// send error obj with status 400
    });
});



    // /todos GET
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos}); // insead of an array-we send an obj - more flexibility later on
    }, (e) => {
        res.status(400).send(e);
    });
});



//-----------------------------

// /todos/:id GET
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) { //validate id with isValid
        return res.status(404).send(); //if not,stop func,respond 404,send()
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {//if valid
        if(!todo) {// and there is no todo with that id
            return res.status(404).send();// respond with 404 status
        }
        res.send({todo});// if there is that todo, respond with todo document
    }).catch((e) => {// if error
        res.status(400).send();// respond with status 400 
    });
});


//------------------------------

// DELETE /todos/:id
app.delete('/todos/:id', authenticate, async (req, res) => {
    // get the id   
    const id = req.params.id;
    // validate the id
    if(!ObjectID.isValid(id)) {// if not valid, return 404 classic shieeet
        return res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
        if(!todo) { // if no doc with that id, return 404
            return res.status(404).send();
        }
        res.status(200).send({todo})// if found, send the doc

    } catch (e) {
        res.status(400).send();// send status 400
    }
});



//---------------------------------------
// UPDATE /todos/:id PATCH
app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);// pick what to update from req.body

    if(!ObjectID.isValid(id)) {//check if ID is valid
        return res.status(404).send();
    }
    //if it is valid and
    if(_.isBoolean(body.completed) && body.completed) {// and if completed is true(and is boolean)
        body.completedAt = new Date().getTime();// adding a timestamp to completedAt property
    } else {// if not true, or not boolean
        body.completed = false; //set completed to false
        body.completedAt = null; // set completedAt to null - no data
    }

    // if conditions are met, we can find a todo and update it
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo){// if no todo
            return res.status(404).send();// send 404
        }

        res.send({todo});// if there is a todo - send it
    }).catch((e) => {
        res.status(400).send();
    })

});




//===================
//     USERS ROUTES
//===================

// POST /users route
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);// obj with email and password
        const user = new User(body);// no need to pass it individually

        await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});




// PRIVATE route
app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});



// POST /users/login
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);// we need the body
        const user = await User.findByCredentials(body.email, body.password);// we 1st await for findBy..
        const token = await user.generateAuthToken();// then we await for token

        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});



// DELETE /users/me/token  ---- private route
app.delete('/users/me/token', authenticate, async (req, res) => {// now async
    try {
        await req.user.removeToken(req.token);// we wait to see if it removes token
        res.status(200).send(); // if it does => send status 200
    } catch (e) {
        res.status(400).send();
    }
});



//=======================================================
app.listen(port, () => {
    console.log(`Server activated on port: ${port}.`);
});

module.exports = {app};