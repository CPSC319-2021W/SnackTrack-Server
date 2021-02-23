import { db } from '../db/index.js'
import { getPagination, getPagingData } from '../util/pagination.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  409: 'Conflict'
}

const Payments = db.payments
const Transactions = db.transactions
const Users = db.users

export const addPayment = async (req, res) => {
  try {
    const payment = req.body
    const userId = payment.user_id
    const user = await Users.findByPk(userId)
    if (user == null) throw new Error(400)

    const updatedBalance = user.balance - payment.payment_amount
    if (updatedBalance < 0) throw new Error(400)
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
    if (code in ERROR_CODES) {
      return res.status(code).send({ Error: ERROR_CODES[code] })
    } else {
      return res.status(500).send({ Error: err.message })
    }
  }
}

export const getPayments = async (req, res) => {
  try {
    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)
  
    const allPayments = await Payments.findAndCountAll({ limit, offset })
    const response = getPagingData(allPayments, page, limit, 'payments')
    res.status(200).send(response)
  } catch (err) {
    // TODO: Handling 401 NOT AUTHORIZED SNAK-123
    res.status(500).send({ Error: err.message })
  }
}
