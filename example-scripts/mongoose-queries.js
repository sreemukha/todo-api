const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//
// let id = '159937f44c8317d7f7e11a26d';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
//
// //
// // Todo.find({
// //   _id:id
// // }).then((todos) => {
// //   console.log('Todos find', todos);
// // });
// //
// // Todo.findOne({
// //   _id:id
// // }).then((todo) => {
// //   console.log(`Todo findOne ${todo}`);
// // });
//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log(`Todo by ID ${todo}`);
// }).catch((e) => console.log(e));

let userId = '599222704a0b3a206c1a158b';

User.findById(userId).then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
