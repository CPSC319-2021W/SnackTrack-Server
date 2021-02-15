import { Transactions } from "./model.js"

const NON_NULL_VIOLATION = "23502"

export const addTransaction = async(req, res) => {
    try {
        const transaction = req.body
        const result = await Transactions.create(transaction)
        return res.status(201).send(result)
    } catch (err) {
        if (err.parent.code === NON_NULL_VIOLATION) return res.status(400).send({ Error: "Bad request, check the request body requirement" })
        else return res.status(401).send({error: err.message})
    }
}
