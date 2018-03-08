const {SHA256} = require('crypto-js'); // sha256 - method for hashing stuff
const jwt = require('jsonwebtoken');


var data = {
    id: 10
};


//hashes the data,returns a token
var token = jwt.sign(data, '123abc');   // 2args - data and 'secret text'
console.log(token);


//takes the token, makes sure that data is not manipulated
var decoded = jwt.verify(token, '123abc'); // 2args - token and the same secret
console.log('decoded - ', decoded);








// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Message: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash) {
//     console.log('data was not changed')
// } else {
//     console.log('data was changed')
// };