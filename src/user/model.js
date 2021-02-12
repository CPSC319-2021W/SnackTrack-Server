import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const DataTypes = Sequelize.DataTypes

// TODO
export const Users = db.define('Users', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  userName: {
      type: DataTypes.STRING(16),
      allowNull: false
  },
  emailAddress:  {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
})
