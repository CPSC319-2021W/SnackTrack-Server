export default (db, DataTypes) => {
 const Admins = db.define('admins', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    }
  })
  return Admins
}

