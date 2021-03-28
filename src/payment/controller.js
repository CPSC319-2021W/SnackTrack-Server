import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'
import { getPaginatedData } from '../util/pagination.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const Payments = db.payments
const Transactions = db.transactions
const Users = db.users
const instance = db.dbInstance

export const addPaymentAll = async (req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
      const payment = req.body
      const user_id = payment.user_id
      const { user_id: currUserId, is_admin } = req.user
      if (!is_admin && parseInt(user_id) !== currUserId) {
        return res.status(403).json({ error: 'Not authorized.' })
      }
      const user = await Users.findByPk(user_id)
      if (!user) {
        return res.status(404).json({ error: 'user_id does not exist in the users table.' })
      }
      payment.payment_amount = user.balance
      await user.update({ balance: 0 }, { transaction: t })
      const result = await Payments.create(payment)
      const payment_id = result.payment_id
      await Transactions.update({ payment_id }, {
        where: { [Op.and]: [{ user_id }, { payment_id: null }] }, transaction: t
      })
      return result
    })
    return res.status(201).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const addPayment = async (req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
      const payment = req.body
      const { user_id, payment_amount, transaction_ids } = payment
      const { user_id: currUserId, is_admin } = req.user
      if (!is_admin && parseInt(user_id) !== currUserId) {
        return res.status(403).json({ error: 'Not authorized.' })
      }
      const user = await Users.findByPk(user_id)
      if (!user) {
        return res.status(404).json({ error: 'user_id does not exist in the users table.' })
      }
      const updatedBalance = user.balance - payment_amount
      if (updatedBalance < 0) {
        return res.status(400).json({ error: 'Unable to carry a balance less than 0.' })
      }
      await user.update({ balance: updatedBalance }, { transaction: t })
      const result = await Payments.create(payment, { transaction: t })
      const payment_id = result.payment_id
      await Transactions.update({ payment_id }, {
        where: { transaction_id: { [Op.in]: transaction_ids } }, transaction: t
      })
      return result
    })
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getUserPayments = async(req, res) => {
  try {
    const user_id = req.params.user_id
    const user = await Users.findByPk(user_id)
    if (!user) {
      return res.status(404).json({ error: 'userid does not exist in the users table.' })
    }
    const order = [['payment_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, { user_id }, Payments, order)
    return res.status(200).json(response)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}
