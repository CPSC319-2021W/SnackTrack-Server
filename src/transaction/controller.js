import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'
import { getPaginatedData } from '../util/pagination.js'
import { decreaseQuantityInSnackBatches, increaseQuantityInSnackBatch } from '../snack/controller.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const PURCHASE = 1
const CANCEL = 2
const PENDING = 3
const PENDING_CANCEL = 4

const Transactions = db.transactions
const Users = db.users
const Snacks = db.snacks
const instance = db.dbInstance

export const updateTransaction = async (req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
      const transaction_id = req.params.transaction_id
      const transaction = await Transactions.findByPk(transaction_id)
      if (!transaction) {
        return res.status(404).json({ error: 'transaction_id does not exist in the transactions table' })
      }
      const user_id = transaction.user_id
      const { user_id: currUserId, is_admin } = req.user
      if (!is_admin && parseInt(user_id) !== currUserId) {
        return res.status(403).json({ error: 'Not authorized.' })
      }
      const snack_name = transaction.snack_name
      const snack = await Snacks.findOne({ where: { snack_name } })
      if (!snack) {
        return res.status(404).json({ error: 'snack with the snack_name does not exist in the snacks table' })
      }
      const from = transaction.transaction_type_id
      const to = req.body.transaction_type_id
      const balance = transaction.transaction_amount
      const selector = { where: { user_id }, transaction: t }
      const handleNonNullPaymentId = (payment_id) => {
        if (payment_id) throw Error('Bad Request: This transaction has been purchased.')
      }
      if (from === to) {
        return transaction
      } else if (from === PURCHASE && to === CANCEL) {
        handleNonNullPaymentId(transaction.payment_id)
        await increaseQuantityInSnackBatch(transaction.quantity, snack.snack_id, t)
        await Users.decrement({ balance }, selector)
      } else if (from === PENDING && to === PURCHASE) {
        await Users.increment({ balance }, selector)
      } else if (from === PENDING && to === PENDING_CANCEL) {
        handleNonNullPaymentId(transaction.payment_id)
        await increaseQuantityInSnackBatch(transaction.quantity, snack.snack_id, t)
      } else {
        throw Error('Bad Request: This update is not allowed.')
      }
      await transaction.update({ transaction_type_id: to }, { transaction: t })
      return transaction
    })
    return res.status(200).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const addTransaction = async (req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
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
      if (transaction_amount < 0) throw Error('Bad Request: transaction_amount should be positive.')
      if (quantity <= 0) throw Error('Bad Request: quantity should be positive.')
      await decreaseQuantityInSnackBatches(quantity, snack_id, t)
      if (transaction_type_id === PURCHASE) {
        const balance = user.balance + transaction_amount
        await user.update({ balance }, { transaction: t })
      }
      const result = await Transactions.create({
        user_id, transaction_type_id,
        snack_name: snack.snack_name,
        transaction_amount, quantity,
      }, { transaction: t })
      return result
    })
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
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
    return res.status(errorCode(err)).json({ error: err.message })
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
    return res.status(errorCode(err)).json({ error: err.message })
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
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getPopularSnacks = async (req, res) => {
  try {
    const { start_date, end_date, transaction_type_id, limit } = req.query
    if (!start_date || !end_date || !transaction_type_id || !limit) {
      throw Error('Bad Request: invalid query')
    }
    let response = await Transactions.findAll({
      where: {
        transaction_type_id,
        payment_id: {
          [Op.ne]: null
        },
        transaction_dtm: { [Op.between]: [new Date(start_date), new Date(end_date)] }
      },
      attributes: [
        'snack_name',
        [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity'],
      ],
      group: ['snack_name'],
    })
    response.sort((a,b) => b.get('total_quantity') - a.get('total_quantity'))
    response = response.splice(0, limit).map(el => el.get({ plain: true }))
    const result = await response.map(async (el) => {
      const snack_name = el.snack_name
      const snack = await Snacks.findOne({ where: { snack_name } })
      el.snack_type_id = snack ? snack.snack_type_id : null
      el.image_uri = snack ? snack.image_uri : null
      return el
    })
    return res.status(200).json(await Promise.all(result))
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}
