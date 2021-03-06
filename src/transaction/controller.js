import { db } from '../db/index.js'
import { getPaginatedData } from '../util/pagination.js'
import { updateSnackBatches } from '../snack/controller.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  404: 'Not Found',
  409: 'Conflict'
}

const Transactions = db.transactions
const Users = db.users
const Snacks = db.snacks

export const addTransaction = async (req, res) => {
  try {
    const transaction = req.body
    const transactionTypeId = transaction.transaction_type_id
    const userId = transaction.user_id
    const snackId = transaction.snack_id
    const user = await Users.findByPk(userId)
    let err = null
    if (!user) {
      err = Error(404)
      err.name = "userid doesn't exist in the users table"
      throw err
    }
    const snack = await Snacks.findByPk(snackId)
    if (!snack) {
      err = Error(404)
      err.name = "snackid doesn't exist in the snacks table"
      throw err
    }

    if (err) throw err

    await updateSnackBatches(transaction, snackId)

    if (transactionTypeId === 1) {
      const balance = user.balance + transaction.transaction_amount
      await user.update({ balance })
    }

    delete transaction.snack_id
    transaction.payment_id = null
    transaction.snack_name = snack.snack_name

    await Transactions.create(transaction)
  } catch (err) {
    const code = Number(err.message)
    if (err.name) {
      return res.status(code).send({ Error: err.name })
    }
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: 'Internal Server Error' })
    }
  }
}

export const getTransactions = async (req, res) => {
  try {
    const where = { transaction_type_id: { [Op.ne]: 3 } }
    const order = [['transaction_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Transactions, order)
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    const code = Number(err.message)
    if (err.name) {
      return res.status(code).send({ Error: err.name })
    }
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: 'Internal Server Error' })
    }
  }
}

export const getUserTransactions = async (req, res) => {
  try {
    const user_id = req.params.userId
    const user = await Users.findByPk(user_id)
    if (!user) throw new Error(404)
    const where = { user_id, transaction_type_id: { [Op.lt]: 3 } }
    const order = [['transaction_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Transactions, order)
    res.status(200).send(response)
  } catch (err) {
    // TODO : handle 401 (Not authorized) case in SNAK-123
    const code = Number(err.message)
    if (err.name) {
      console.log(err)
      return res.status(code).send({ Error: err.name })
    }
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: 'Internal Server Error' })
    }
  }
}

export const getUserTransaction = async (req, res) => {
  try {
    const { user_id, transaction_id } = req.params
    const transaction = await Transactions.findOne({
      where: { transaction_id, user_id }
    })
    if (!transaction) throw new Error(404)
    return res.status(200).json(transaction)
  } catch (err) {
    // TODO : handle 401 (Not authorized) case in SNAK-123
    const code = Number(err.message)
    if (err.name) {
      return res.status(code).send({ Error: err.name })
    }
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: 'Internal Server Error' })
    }
  }
}

export const getPendingOrders = async (req, res) => {
  try {
    const user_id = req.params.userId
    const user = await Users.findByPk(user_id)
    if (!user) throw new Error(404)
    const where = { user_id, transaction_type_id: { [Op.eq]: 3 } }
    const order = [['transaction_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Transactions, order)
    res.status(200).send(response)
  } catch (err) {
    // TODO : handle 401 (Not authorized) case in SNAK-123
    const code = Number(err.message)
    if (err.name) {
      return res.status(code).send({ Error: err.name })
    }
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: 'Internal Server Error' })
    }
  }
}
