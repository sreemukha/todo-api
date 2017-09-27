const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


let UserSchema = new mongoose.Schema({
    email:{
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
        isAsync: false,
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
    let user = this; // instance of User model as this binding
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access: access}, process.env.JWT_SECRET).toString();
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

UserSchema.methods.removeToken = function(token) {
  // mongodb operator $pull removes items from array that match certain criteria
  let user = this;
  return user.update({
    $pull: {
      tokens: {
        token:token // ES6 - just token instead of token: token
      }
    }
  })
};

// model method using statics object

UserSchema.statics.findByToken = function(token){
  let User = this; // whole model as this binding
  let decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    // return a promise
    return Promise.reject();

    // return new Promise((resolve, reject) => {
    //   reject();
    // });
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err,res) => {
        if(res){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// Mongoose middleware

// runs before save() method

UserSchema.pre('save', function(next) {
  let user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10,(err, salt) => {
      bcrypt.hash(user.password, salt, (err,hash) => {
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

// create User model

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
