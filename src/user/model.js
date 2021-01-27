import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const DataTypes = Sequelize.DataTypes

// TODO
export const Users = db.define('Users', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  Username: {
      type: DataTypes.STRING,
      allowNull: false
  }
})
