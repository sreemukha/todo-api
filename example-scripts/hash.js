const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
  id: 5
}

let token = jwt.sign(data, 'secret');
console.log(token);


let decoded = jwt.verify(token, 'secret');
console.log('decoded: ', decoded);

// JSON Web Token
// All this can be done using JWT library

// let msg = 'Hello, World!';
// let hashMsg = SHA256(msg);
//
//
// console.log(`Message: ${msg}`);
// console.log(`Hashed Message: ${hashMsg}`);
//
// let data = {
//   id: 4
// };
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// } else {
//   console.log('Data changed!');
// }
