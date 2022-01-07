const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {
    String,
    unique: true,
    required: true,
  },
  passwordHash: String,
  contact: {
    firstname: String,
    lastname: String,
    email: { 
      type: String,
      unique: true,
      required: true
    }
  },
  boards: [String],
  newsfeeds: [String],
  homefeedboard: String
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
