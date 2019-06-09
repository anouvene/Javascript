var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();
var conn = require('./connexion').connexion;

var bodyParser = require('body-parser');

var cons = require('consolidate');

// Routeurs / Contrôleurs
var indexRouter = require('./routes/index');

var personnesRouter = require('./routes/personnes');

var societesRouter = require('./routes/societes');

var accueilSocietesRouter = require('./routes/accueilSocietes');

// Vues
var swig  = require('swig');
swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.engine('html', cons.swig);
// app.set('view engine', 'html');
//app.engine('html', cons.swig);

// Parseur JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use('/', indexRouter);

app.use('/accueil-societes', accueilSocietesRouter);

app.use('/societes', societesRouter);

app.use('/personnes', personnesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
