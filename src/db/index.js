import { Sequelize } from 'sequelize'
import Payments from '../payment/model.js'
import Users from '../user/model.js'
import Snacks from '../snack/model.js'
import SnackTypes from '../snack/snackTypes.js'
import SnackBatches from '../snack/snackBatches.js'
import Transactions from '../transaction/model.js'
import TransactionTypes from '../transaction/transactionTypes.js'
import Suggestions from '../suggestion/model.js'

import dotenv from 'dotenv'
dotenv.config()

export const dbInstance = new Sequelize(
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
    },
    define: {
      timestamps: false
    }
  }
)

export const db = {}

db.Sequelize = Sequelize
db.dbInstance = dbInstance

db.payments = Payments(dbInstance, Sequelize)
db.snacks = Snacks(dbInstance, Sequelize)
db.snackTypes = SnackTypes(dbInstance, Sequelize)
db.snackBatches = SnackBatches(dbInstance, Sequelize)
db.transactions = Transactions(dbInstance, Sequelize)
db.transactionTypes = TransactionTypes(dbInstance, Sequelize)
db.users = Users(dbInstance, Sequelize)
db.suggestions = Suggestions(dbInstance, Sequelize)

db.payments.belongsTo(db.users, { foreignKey: 'user_id' })
db.snacks.belongsTo(db.snackTypes, { foreignKey: { name: 'snack_type_id' } })
db.snacks.hasMany(db.snackBatches, { foreignKey: { name: 'snack_id' } })
db.transactions.belongsTo(db.users, { foreignKey: 'user_id' })
db.transactions.belongsTo(db.payments, { foreignKey: { name: 'payment_id', defaultValue: null } })
db.transactions.belongsTo(db.transactionTypes, { foreignKey: 'transaction_type_id' })

export const connect = async () => {
  try {
    await dbInstance.authenticate()
    console.log('Connection has been established successfully.')

    await dbInstance.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export const disconnect = () => dbInstance.close()
