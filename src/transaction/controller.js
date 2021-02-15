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
