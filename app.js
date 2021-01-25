var express = require('express')
var bodyParser = require('body-parser')
var userRouter = require('./src/user')

const app = express()

app.set('port', '5001')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', userRouter)
var  connect = require('./src/db')
const start = async () => {
  await connect()
  app.listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    )
    console.log('  Press CTRL-C to stop\n')
  })
}

start()

module.exports = app;

// var createError = require('http-errors')
// var cookieParser = require('cookie-parser')
// var logger = require('morgan')

// app.use(cookieParser());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
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


