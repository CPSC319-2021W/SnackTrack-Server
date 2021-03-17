export default (db, DataTypes) => {
  const Suggestions = db.define('suggestions', {
    suggestion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    suggested_by: {
      type: DataTypes.INTEGER,
    },
    suggestion_text: {
      type: DataTypes.STRING
    },
    suggestion_dtm: {
      type: DataTypes.DATE
    }
  }, { underscored: true })
  return Suggestions
}
