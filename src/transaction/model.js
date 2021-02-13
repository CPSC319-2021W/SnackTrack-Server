import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const DataTypes = Sequelize.DataTypes

// Transactions model
export const Transactions = db.define('transactions', {
    transactionid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
            model: Users
            key: 'userid'
        }
    },
    transactiontypeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TransactionTypes,
            key: transactiontypeid
        }
    },
    paymenthistoryid: {
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        references: {
            model: PaymentHistory,
            key: 'paymenthistoryid'
        }
    },
    snackname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactionamount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transactiondtm: {
        type: 'TIMESTAMP',
        allowNull: false
    }
})

// TransactionTypes model
export const TransactionTypes = db.define('transactiontypes', {
    transactiontypeid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    transactiontypename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transactiontypecode: {
        type: DataTypes.STRING,
        allowNull: false
    }
})