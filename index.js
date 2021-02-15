import app from './app.js'
import { connect } from './src/db/index.js'

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
