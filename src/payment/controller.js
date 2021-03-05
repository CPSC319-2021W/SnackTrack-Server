import { db } from '../db/index.js'
import { getPaginatedData } from '../util/pagination.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  404: 'Not Found',
  409: 'Conflict'
}

const Payments = db.payments
const Transactions = db.transactions
const Users = db.users

export const addPayment = async (req, res) => {
  try {
    const payment = req.body
    const userId = payment.user_id
    const { user_id, is_admin } = req.user
    if (!is_admin && user_id !== parseInt(userId)) {
      return res.sendStatus(403)
    }
    const user = await Users.findByPk(userId)
    if (user == null) {
      let err = new Error(404)
      err.name = "userid doesn't exist in the users table"
      throw err
    }

    const updatedBalance = user.balance - payment.payment_amount
    if (updatedBalance < 0) {
      let err = new Error(400)
      err.name = 'Unable to carry a balance less than 0.'
      throw err
    }
    await user.update({ balance: updatedBalance })

    const result = await Payments.create(payment)
    const transactions = req.body.transaction_ids
    const paymentId = result.payment_id
    transactions.forEach(async id => {
        const transaction = await Transactions.findByPk(id)
        transaction.update({ payment_id: paymentId })
    })
    return res.status(201).send(result)
  } catch (err) {
    const code = Number(err.message)
    if (err.name) {
      return res.status(code).send({ Error: err.name })
    }
    else if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: err.message })
    }
  }
}

export const getPayments = async (req, res) => {
  try {
    const order = [['payment_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, {}, Payments, order)
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

export const getUserPayments = async(req, res) => {
  try {
    const user_id = req.params.userId
    const user = await Users.findByPk(user_id)
    if (!user) throw new Error(404)
    const where = { user_id }
    const order = [['payment_dtm', 'DESC']]
    const response = await getPaginatedData(req.query, where, Payments, order)
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
