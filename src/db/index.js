import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

export const db = new Sequelize(
  process.env.DB_TABLENAME, 
  process.env.DB_USERID, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT,
    protocol: process.env.DB_PROTOCOL,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false 
      }
    }
  }
);

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

