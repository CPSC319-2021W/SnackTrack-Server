var Sequelize = require('sequelize')

const db = new Sequelize(process.env.DB_CONNECTION)

async function connect() {
  try {
    await db.authenticate()
    console.log('Connection has been established successfully.')

    await db.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const disconnect = () => db.close()

module.exports = {
  db: db,
  connect : connect,
  disconnect: disconnect
}