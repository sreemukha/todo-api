const mongoose = require('mongoose');
const validator = require('validator');


let User = mongoose.model('User', {
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
          return validator.isEmail(value);
      },
      message: '{VALUE} is an invalid email'
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});



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
