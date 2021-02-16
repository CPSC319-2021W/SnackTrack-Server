import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const { DataTypes } = Sequelize

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