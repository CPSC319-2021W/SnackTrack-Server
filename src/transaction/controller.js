import { Transactions } from './model.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  409: 'Conflict'
}

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
    let response = getPagingData(allTransactions, page, limit)
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    res.status(500).send({ Error: err.message })
  }
}

const getPagination = (page, size) => {
  const limit = size ? +size : 8
  const offset = page ? page * limit : 0
  return { limit, offset }
}

const getPagingData = (data, page, limit) => {
  const { count: totalRows, rows: transactions } = data
  const currentPage = page ? +page : 0
  let totalPages = Math.ceil(totalRows / limit)
  if (totalPages === 0) totalPages = 1
  return { totalRows, transactions, totalPages, currentPage }
}