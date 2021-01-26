const DataTypes = require('sequelize').DataTypes
const db = require('../db').db

// TODO: @jessica edit DB schema 
const Users = db.define('Users', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  Username: {
      type: DataTypes.STRING,
      allowNull: false
  }
})

module.exports = Users
