const mongoose = require('mongoose');



// Model for the Todo
let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

//
// Create instance of Todo model and save it to mongodb
// // let newTodo = new Todo({
//   text:'Example todo'
// });
//
// newTodo.save().then((doc) =>{
//   console.log(`Saved todo ${doc}`);
// }, (err) => {
//   console.log('Unable to save todo');
// });

module.exports = {Todo};
