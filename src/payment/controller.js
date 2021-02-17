import { Payments } from './model.js'
import { Transactions } from '../transaction/model.js'

const ERROR_CODES = {
  400: 'Bad Request',
  401: 'Not Authorized',
  409: 'Conflict'
}

export const addPayment = async (req, res) => {
  try {
    const payment = req.body
    const result = await Payments.create(payment)
    const transactions = req.body.transaction_ids
    const paymentId = result.dataValues.payment_id
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
