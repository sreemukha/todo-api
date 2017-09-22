const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove() - multiple remove - doesn't return doc

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove() - returns doc

// Todo.findByIdAndRemove() - returns doc

Todo.findByIdAndRemove('59c59f1f856a70f3a4f05111').then((todo) => {
  console.log(todo);
});
