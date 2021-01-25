var express = require('express')
var bodyParser = require('body-parser')
var userRouter = require('./src/user')

const app = express()

app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', userRouter)

module.exports = app;

// TODO: @hyunuk Add necessary features.
// var createError = require('http-errors')
// var cookieParser = require('cookie-parser')
// var logger = require('morgan')

// app.use(cookieParser());
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// app.use(logger('dev'));
// app.use(express.json());
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error');
// });


