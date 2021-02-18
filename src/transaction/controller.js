import { db } from '../db/index.js'
import { getPagination, getPagingData } from '../util/pagination.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  409: 'Conflict'
}

const Transactions = db.transactions

export const addTransaction = async (req, res) => {
  try {
    const transaction = req.body
    const result = await Transactions.create(transaction)
    return res.status(201).send(result)
  } catch (err) {
    const code = Number(err.message)
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
  
    const allTransactions = await Transactions.findAndCountAll({ limit, offset })
    const response = getPagingData(allTransactions, page, limit, 'transactions')
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    res.status(500).send({ Error: err.message })
  }
}
