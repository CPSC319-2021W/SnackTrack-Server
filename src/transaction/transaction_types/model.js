import { db } from "../../db"

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
