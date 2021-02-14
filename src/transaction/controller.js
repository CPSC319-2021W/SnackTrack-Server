import { Transactions } from "./model.js"

const BAD_REQUEST = "400"
const NOT_AUTHORIZED = "401"

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

export const addTransaction = async(req, res) => {
    try {
        const transaction = req.body

        // Transaction date in ISO standard format
        transaction.transaction_dtm = new Date().toISOString()

        const result = await Transactions.create(transaction)

        return res.status(201).send(result)
    } catch (err) {
        if (err.message === BAD_REQUEST) return res.status(400).send({ Error: "Bad Request" })
        else if (err.message === NOT_AUTHORIZED) return res.status(401).send({ Error: "Not Authorized" })
        else return res.status(409).send({ Error: "Conflict" })
    }
}
