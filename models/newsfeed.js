const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const newsFeedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    likes: Number,
    categories: [String],
    link: {
        type: String,
        unique: true
    },
    language: String,
    description: String
});

newsFeedSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

newsFeedSchema.plugin(uniqueValidator);
module.exports = mongoose.model('NewsFeed', newsFeedSchema);