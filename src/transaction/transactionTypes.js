export default (db, DataTypes) => {
    const TransactionTypes = db.define('transaction_types', {
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
    return TransactionTypes
}
