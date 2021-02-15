import { Transactions } from './model.js'

// Return all transactions
export const getTransactions = async(req, res) => {
    try {
        const transactions =  await Transactions.findAll()
        const response = JSON.stringify(transactions)

        return res.status(200).send(response)
    } catch (err) {
        return res.status(401).send({ Error: err.message })
    }
}
