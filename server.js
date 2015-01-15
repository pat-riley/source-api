// set up ======================================================================
var express   = require('express');
var app       = express();
var port      = process.env.PORT || 8080;
var mongoose  = require('mongoose');
var passport  = require('passport');
var flash     = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


// Load Controllers & Config
var configDB 		  = require('./config/database.js');
var articleController = require('./app/controllers/article');
var userController    = require('./app/controllers/user');
var authController    = require('./app/controllers/auth');

var cors      = require('cors');

// Database ===============================================================
mongoose.connect(configDB.url); // connect to our database


// Express Application =====================================================
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs'); // set up ejs for templating



// Passport
app.use(passport.initialize());


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



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
