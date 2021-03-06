export default (db, DataTypes) => {
  const Transactions = db.define('transactions', {
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
  }, { underscored: true })
  return Transactions
}
