import { Transactions } from "./model.js"

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

// export const addTransaction = async(req, res) => {
//     try {
//         console.log("Adding a new transaction")
//         const transaction = req.body
//
//         const result = await Transactions.create(transaction)
//         console.log('Successfully added : ', result)
//         res.sendStatus(201)
//         // 201 Created
//
//         console.log("Successfully added a new transaction")
//     } catch (err) {
//         // 400 Bad Request
//         // 401 Not Authorized
//         // 409 Conflict
//     }
// }
