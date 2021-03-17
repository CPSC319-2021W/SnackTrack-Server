export default (db, DataTypes) => {
  return db.define('snack_types', {
    snack_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    snack_type_name: {
      type: DataTypes.STRING(128)
    }
  }, { underscored: true })
}
