const mongoose = require('mongoose');


let User = mongoose.model('UserModel', {
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
}, 'users');

//
// Create instance of User model and save it to mongodb
// // let newUser = new User({
//   email:'addinguser@usercollection.com'
// });
//
// newUser.save().then((doc) =>{
//   console.log(`Saved User ${doc}`);
// }, (err) => {
//   console.log('Unable to save user');
// });


module.exports = {User};
