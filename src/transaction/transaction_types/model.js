import { Sequelize } from 'sequelize'
import { db } from '../../db/index.js'

const { DataTypes } = Sequelize

// TransactionTypes model
const TransactionTypes = db.define('transaction_types', {
    transaction_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

export default TransactionTypes
