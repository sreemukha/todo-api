const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  //ES6
  mongoose
  // mongoose:mongoose - ES5
};
