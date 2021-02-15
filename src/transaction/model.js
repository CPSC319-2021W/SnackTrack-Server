import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from '../user/model.js'
import PaymentHistory from '../payment/model.js'

const { DataTypes } = Sequelize

export const Transactions = db.define('transactions', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  snack_name: {
    type: DataTypes.STRING(128)
  },
  transaction_amount: {
    type: DataTypes.INTEGER
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  transaction_dtm: {
    type: DataTypes.DATE
  }
})

export const TransactionTypes = db.define('transactionTypes', {
  transaction_type_id: {
    type: DataTypes.INTEGER
  },
  transaction_type_name: {
    type: DataTypes.STRING(128)
  },
  transaction_type_code: {
    type: DataTypes.STRING(2)
  }
})

Transactions.belongsTo(Users, { foreignKey: 'user_id' })
Transactions.belongsTo(PaymentHistory, { foreignKey: 'payment_history_id' })
Transactions.belongsTo(TransactionTypes, { foreignKey: 'transaction_type_id' })
