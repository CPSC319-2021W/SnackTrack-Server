import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from "../user/model.js"

const DataTypes = Sequelize.DataTypes

// Transactions model
export const Transactions = db.define('transactions', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    transaction_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transaction_types',
            key: 'transaction_type_id'
        }
    },
    payment_history_id: {
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        references: {
            model: 'payment_history',
            key: 'payment_history_id'
        }
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
        type: 'TIMESTAMP',
        allowNull: false
    }
})

Transactions.hasOne(Users)
Transactions.hasOne(TransactionTypes)
Transactions.hasOne(PaymentHistory)

// TransactionTypes model
export const TransactionTypes = db.define('transaction_types', {
    transaction_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    transaction_type_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    transaction_type_code: {
        type: DataTypes.STRING(2),
        allowNull: false
    }
})
