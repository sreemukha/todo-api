const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


let UserSchema = new mongoose.Schema({
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

// Instance methods on the User model

// not arrow function because 'this' keyword is required here
// arrow functions do not bind 'this' keyword

// overriding toJSON method
UserSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject(); // mongoose variable 'user' to regular object
  return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access: access}, 'secret').toString();
    // ES5 syntax without destructuring
    // user.tokens.push({
    //   access:access,
    //   token:token
    // });

    // ES6 syntax with destructuring
    user.tokens.push({access, token});

    // this will be a success for promise in server.js
    return user.save().then(() => {
      return token;
    });
};

let User = mongoose.model('User', UserSchema);



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
