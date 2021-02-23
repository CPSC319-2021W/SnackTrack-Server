import { Sequelize } from 'sequelize'
import { db } from '../db/index.js'
import { getPagination, getPagingData } from '../util/pagination.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  404: 'Not Found',
  409: 'Conflict'
}

const Op = Sequelize.Op

const Transactions = db.transactions
const SnackBatches = db.snackBatches
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

    await updateSnackBatches(transaction, snackId)

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

async function updateSnackBatches(transaction, snackId) {
  const snackBatches = await SnackBatches.findAll({
    where: {
      snack_id: snackId,
      expiration_dtm: {
        [Op.or]: {
          [Op.gt]: new Date(),
          [Op.eq]: null
        }
      }
    },
    order: ['expiration_dtm']
  })
  
  let requestedQuantity = transaction.quantity
  const totalQuantity = snackBatches.reduce((prev, cur) => {
    return prev + cur.quantity
  }, 0)

  if (requestedQuantity > totalQuantity) throw new Error(400)
  
  for (const snackBatch of snackBatches) {
    if (requestedQuantity > snackBatch.quantity) {
      requestedQuantity -= snackBatch.quantity
      await snackBatch.destroy()
      continue
    }

    const updatedQuantity = snackBatch.quantity - requestedQuantity
    if (updatedQuantity == 0) {
      await snackBatch.destroy()
    } else {
      await snackBatch.update({ quantity: updatedQuantity })
    }
    break
  }
}

export const getTransactions = async (req, res) => {
  try {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)
  
    const allTransactions = await Transactions.findAndCountAll({ limit, offset })
    const response = getPagingData(allTransactions, page, limit, 'transactions')
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    res.status(500).send({ Error: err.message })
  }
}
