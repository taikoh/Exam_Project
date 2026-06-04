require("dotenv").config({ path: "../.env" });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");

var app = express();

// view engine setup
const productsRouter = require("./routes/products")
const loginRouter = require("./routes/login")
const brandsRouter = require("./routes/brands")
const categoriesRouter = require("./routes/categories")
const usersRouter = require("./routes/users")
const ordersRouter = require("./routes/orders")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

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
