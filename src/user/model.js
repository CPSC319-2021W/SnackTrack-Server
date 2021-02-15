import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const { DataTypes } = Sequelize

export const Users = db.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  email_address: {
    type: DataTypes.STRING
  },
  balance: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN
  }
})
