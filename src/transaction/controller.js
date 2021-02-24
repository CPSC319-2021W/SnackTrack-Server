import { db } from '../db/index.js'
import { getPagination, getPagingData } from '../util/pagination.js'
import sequelize from 'sequelize'
const { Op } = sequelize

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
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
    if (user == null) {
      let err = Error(404)
      err.name = "userid doesn't exist in the users table"
      throw err
    }
    const snack = await Snacks.findByPk(snackId)
    if (snack == null) {
      let err = Error(404)
      err.name = "snackid doesn't exist in the snacks table"
      throw err
    }

    if (transactionTypeId == 2) {
      let err = Error(400)
      err.name = 'New transactions cannot be processed as cancelled'
      throw err
    }
    else if (transactionTypeId == 1) {
      const updatedBalance = user.balance + transaction.transaction_amount
      await user.update({ balance: updatedBalance })
    }

    delete transaction.snack_id
    transaction.payment_id = null
    transaction.snack_name = snack.snack_name

    const result = await Transactions.create(transaction)
    return res.status(201).send(result)
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
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)
  
    const allTransactions = await Transactions.findAndCountAll({
      where: {
        transaction_type_id: { [Op.ne]: 3 }
      },
      limit,
      offset,
      order: [['transaction_dtm', 'DESC']]
     })
    const response = getPagingData(allTransactions, page, limit, 'transactions')
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    res.status(500).send({ Error: err.message })
  }
}
