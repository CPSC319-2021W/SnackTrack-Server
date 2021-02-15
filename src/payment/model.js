import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { Users } from '../user/model.js'

const { DataTypes } = Sequelize

const PaymentHistory = db.define('payment_history', {
  payment_history_id: {
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

PaymentHistory.belongsTo(Users, { foreignKey: 'user_id' })

export default PaymentHistory
