const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')
var  db = require('./src/db')

const start = async () => {
  await db.connect()
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
