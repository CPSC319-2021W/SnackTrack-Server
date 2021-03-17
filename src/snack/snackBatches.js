export default (db, DataTypes) => {
  return db.define('snack_batches', {
    snack_batch_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    expiration_dtm: {
      type: DataTypes.DATE
    }
  }, { underscored: true })
}
