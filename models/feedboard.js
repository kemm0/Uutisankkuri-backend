const mongoose = require('mongoose');

const feedBoardSchema = new mongoose.Schema({
    public: {
      type: Boolean,
      required: true
    },
    creator: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    categories: [String],
    languages: [String],
    searchKeyWords: [String],
    subscribers: [String],
    newsfeeds: [String]
  });

  feedBoardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('feedBoard', feedBoardSchema);
  