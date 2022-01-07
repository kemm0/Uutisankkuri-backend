const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const newsArticleSchema = new mongoose.Schema({
    headline: String,
    link: {
        type: String,
        unique: true
    },
    language: String,
    categories: [String],
    usersRead: [String],
    newsfeeds: [String]
});

newsArticleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

newsArticleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('NewsArticle', newsArticleSchema);