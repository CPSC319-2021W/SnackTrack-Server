import { db } from '../db/index.js'
import { getPaginatedData } from '../util/pagination.js'
import { updateSnackBatches } from '../snack/controller.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const Transactions = db.transactions
const Users = db.users
const Snacks = db.snacks

export const addTransaction = async (req, res) => {
  try {
    const transaction = req.body
    const {
      transaction_type_id, user_id, snack_id,
      transaction_amount, quantity,
    } = transaction
    const user = await Users.findByPk(user_id)
    if (!user) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    const snack = await Snacks.findByPk(snack_id)
    if (!snack) {
      return res.status(404).json({ error: 'snack_id does not exist in the snacks table' })
    }
    await updateSnackBatches(transaction, snack_id)
    if (transaction_type_id === 1) {
      const balance = user.balance + transaction_amount
      await user.update({ balance })
    }
    const result = await Transactions.create({
      user_id, transaction_type_id,
      snack_name: snack.snack_name,
      transaction_amount, quantity,
    })
    return res.status(201).json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const getUserTransactions = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const user = await Users.findByPk(user_id)
    if (!user) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    const where = { user_id, transaction_type_id: { [Op.lt]: 3 } }
    const order = [['transaction_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Transactions, order)
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const getUserTransaction = async (req, res) => {
  try {
    const { user_id, transaction_id } = req.params
    const transaction = await Transactions.findOne({ where: { transaction_id, user_id } })
    if (!transaction) {
      return res.status(404).json({ error: 'transaction does not exist in the table' })
    }
    return res.status(200).json(transaction)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const getPendingOrders = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const user = await Users.findByPk(user_id)
    if (!user) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    const where = { user_id, transaction_type_id: { [Op.eq]: 3 } }
    const order = [['transaction_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Transactions, order)
    return res.status(200).send(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
