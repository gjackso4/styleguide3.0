var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var expressMessages = require('express-messages');


//Connect to DB
mongoose.connect(config.database, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to MongoDB")
});


//Init app
var app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Set global errors variables
app.locals.errors = null;

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Set Route
var pages = require('./routes/pages.js');
var admin = require('./routes/admin.js');
var admin_pages = require('./routes/admin-page.js');
var admin_categories = require('./routes/admin-categories.js');

app.use('/admin/categories', admin_categories);
app.use('/admin/pages', admin_pages);
app.use('/admin', admin);
app.use('/', pages);


//Start the server
var port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});