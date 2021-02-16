import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from '../user/model.js'
import TransactionTypes from './transaction_types/model.js'

const { DataTypes } = Sequelize

// Transactions model
const Transactions = db.define('transactions', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    snack_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    transaction_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transaction_dtm: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

Transactions.hasOne(Users)
Transactions.hasOne(TransactionTypes)
Transactions.hasOne(PaymentHistory)

export default Transactions
