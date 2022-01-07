const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }
  });

  categorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  });

  categorySchema.plugin(uniqueValidator);
  module.exports = mongoose.model('Category', categorySchema);