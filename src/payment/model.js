import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from '../user/model.js'

const { DataTypes } = Sequelize

const Payments = db.define('payments', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_amount: {
    type: DataTypes.INTEGER
  },
  payment_dtm: {
    type: DataTypes.DATE
  },
  created_by: {
    type: DataTypes.STRING
  }
})

Payments.belongsTo(Users, { foreignKey: 'user_id' })

export default Payments
