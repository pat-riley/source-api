// app/models/article.js
// load the things we need
var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

// define the schema for our user model
var ArticleSchema = new Schema({
    url: String,
    userSummary: String,
    userID: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', ArticleSchema);