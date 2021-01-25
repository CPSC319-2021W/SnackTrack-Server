var Sequelize = require('sequelize')

const db = new Sequelize("postgres://snack:track@localhost:5050/snacktrack")

const connect = async () => {
  try {
      console.log("heelo")
    await db.authenticate()
    console.log('Connection has been established successfully.')

    await db.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const disconnect = () => db.close()

module.exports = db
module.exports = connect
module.exports = disconnect
