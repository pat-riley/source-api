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


// Load Controllers
var articleController = require('./app/controllers/article');
var userController    = require('./app/controllers/user');

// API Endpoints ============================
// ===============================================
var router = express.Router();     // Get instance of express Router

// Creates an enpoint handler for /articles
router.route('/articles')
	.post(articleController.postArticles)
	.get(articleController.getArticles);

// Creates an endpoint handler for /articles:article_id
router.route('/articles/:article_id')
	.get(articleController.getArticle)
	.put(articleController.putArticle)
	.delete(articleController.deleteArticle);

// Creates endpoint handlers for /users
router.route('/users')
	.post(userController.postUsers)
	.get(userController.getUser);





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
