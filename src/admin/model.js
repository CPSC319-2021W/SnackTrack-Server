import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const DataTypes = Sequelize.DataTypes

export const Admins = db.define('admins', {
  adminid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
      type: DataTypes.INTEGER,
  }
})
