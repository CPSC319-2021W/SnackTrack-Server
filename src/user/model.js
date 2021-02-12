import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'

const DataTypes = Sequelize.DataTypes

export const Users = db.define('users', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
      type: DataTypes.STRING,
  },
  emailaddress:  {
    type: DataTypes.STRING,
  },
  balance: {
    type: DataTypes.INTEGER,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
  }
})
