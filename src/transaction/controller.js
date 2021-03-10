import { db } from '../db/index.js'
import { getPaginatedData } from '../util/pagination.js'
import { decreaseQuantityInSnackBatches, increaseQuantityInSnackBatch } from '../snack/controller.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const Transactions = db.transactions
const Users = db.users
const Snacks = db.snacks

export const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transaction_id
    const transaction = await Transactions.findByPk(transactionId)
    if (!transaction) {
      return res.status(404).json({ error: 'transaction_id does not exist in the transactions table' })
    }

    const snack_name = transaction.snack_name
    const snack = await Snacks.findOne({ where: { snack_name } })
    if (!snack) {
      return res.status(404).json({ error: 'snack with the snack_name does not exist in the snacks table' })
    }

    const currTransactionTypeId = transaction.transaction_type_id
    const newTransactionTypeId = req.body.transaction_type_id
    const balance = transaction.transaction_amount
    const user_id = transaction.user_id
    const query = { balance, where: { user_id } }
    if (currTransactionTypeId === newTransactionTypeId) {
      return res.status(200).json(transaction)
    } else if (currTransactionTypeId === 1 && newTransactionTypeId === 2) {
      if (transaction.payment_id) {
        throw Error('Bad Request: This transaction has been purchased.')
      }
      await increaseQuantityInSnackBatch(transaction.quantity, snack.snack_id)
      await Users.decrement(query)
    } else if (currTransactionTypeId === 3 && newTransactionTypeId === 1) {
      await Users.increment(query)
    } else if (currTransactionTypeId === 3 && newTransactionTypeId === 4) {
      if (transaction.payment_id) {
        throw Error('Bad Request: This transaction has been purchased.')
      }
      await increaseQuantityInSnackBatch(transaction.quantity, snack.snack_id)
    } else {
      throw Error('Bad Request: This update is not allowed.')
    }

    await transaction.update({ transaction_type_id: newTransactionTypeId })
    return res.status(200).send(transaction)
  } catch (err) {
    if (err.message.startsWith('Bad Request:')) {
      return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: err.message })
  }
}

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
    await decreaseQuantityInSnackBatches(quantity, snack_id)
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
    if (err.message === 'Bad Request: Requested quantity exceeds the total stock.') {
      res.status(400).json({ error: err.message })
    }
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
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
