const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  //ES6
  mongoose
  // mongoose:mongoose - ES5
};
