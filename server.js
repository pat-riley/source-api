// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// Models ==================================================
var Article		 = require('./app/models/article.js');


// Routes for the API ============================
// ===============================================
var router = express.Router();     // Get instance of express Router


router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); //make sure we go to the next routes and don't stop here
});


//test route
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/articles')

    // create a bear (accessed at POST http://localhost:8080/api/article)
    .post(function(req, res) {
        
        var article = new Article();      // create a new instance of the article model
        article.name = req.body.name;  // set the article name (comes from the request)

        // save the bear and check for errors
        article.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Article created!' });
        });
        
    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Article.find(function(err, articles) {
            if (err)
                res.send(err);

            res.json(articles);
        });
    })





// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/articles/:article_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Article.findById(req.params.article_id, function(err, article) {
            if (err)
                res.send(err);
            res.json(article);
        });
    })

        // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Article.findById(req.params.article_id, function(err, article) {

            if (err)
                res.send(err);

            article.name = req.body.name;  // update the bears info

            // save the bear
            article.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Article updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Article.remove({
            _id: req.params.article_id
        }, function(err, article) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });







// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
