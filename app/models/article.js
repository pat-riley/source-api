// app/models/article.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var articleSchema = mongoose.Schema({
    url:            String,
    userSummary:    String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', articleSchema);
