require("dotenv").config({ path: "../.env" });
const db = require("./models");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jsend = require("jsend")
const swaggerFile = require("./swagger-output.json");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");


async function resetDatabase() {

  try {

    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await db.sequelize.sync({ force: false });

    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Database recreated");

  } catch (err) {
    console.error(err);
  }

}

resetDatabase();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const initRouter = require("./routes/init");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const categoryRouter = require("./routes/categories")
const brandRouter = require("./routes/brands");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");
const searchRouter = require("./routes/search");
const userRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(jsend.middleware);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/auth", authRouter)
app.use('/users', usersRouter);
app.use("/init", initRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/brands", brandRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/search", searchRouter);
app.use("/users", userRouter);
app.use("/roles", rolesRouter);

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));


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
