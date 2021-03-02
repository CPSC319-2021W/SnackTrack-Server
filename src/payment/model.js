export default (db, DataTypes) => {
  const Payments = db.define('payments', {
    payment_id: {
     type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_amount: {
      type: DataTypes.INTEGER
   },
    payment_dtm: {
      type: DataTypes.DATE
   },
    created_by: {
      type: DataTypes.STRING
    }, 
  }, {underscored: true})
  return Payments
}

