import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from '../user/model.js'

const DataTypes = Sequelize.DataTypes

export const Admins = db.define('admins', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
})

Admins.belongsTo(Users, {foreignKey: 'user_id'})

