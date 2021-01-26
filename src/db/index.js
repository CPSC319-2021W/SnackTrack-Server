import { Sequelize } from 'sequelize'

//TODO: update .env
export const db = new Sequelize('snacktrack', 'snack', 'track', {
  host: 'localhost',
  dialect: 'postgres'
});


export const connect = async () => {
  try {
    await db.authenticate()
    console.log('Connection has been established successfully.')

    await db.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export const disconnect = () => db.close()

