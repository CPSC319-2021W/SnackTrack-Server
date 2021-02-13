import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from "../user/model";

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
            model: Users,
            key: 'user_id'
        }
    },
    transactiontype_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TransactionTypes,
            key: transactiontype_id
        }
    },
    paymenthistory_id: {
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        references: {
            model: PaymentHistory,
            key: 'paymenthistory_id'  // payment_history-id ?
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

// TransactionTypes model
export const TransactionTypes = db.define('transactiontypes', {
    transactiontype_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    transactiontype_name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    transactiontype_code: {
        type: DataTypes.STRING(2),
        allowNull: false
    }
})