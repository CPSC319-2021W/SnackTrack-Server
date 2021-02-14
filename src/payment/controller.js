import { PaymentHistory } from './model.js'

export const addPayment = async(req, res) => {
    try {
        const paymentRecord = req.body
        const transactionList = paymentRecord.transactions_ids

        transactionList.forEach(transactions_id => {
            // TODO- Blocked by transaction model.js
        })

        res.status(201).send("TODO")
    } catch (err) {
        return res.status(400).send({ Error: err.message })
    }
}

