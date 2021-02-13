import { Transactions } from "./model"
import { db } from "../db"

// Return all transactions
export const getTransactions = async(req, res) => {
    try {
        console.log("Getting all transactions")

        const transactions =  await Transactions.findAll()

        const response = JSON.stringify(transactions)

        console.log("Successfully got all transactions")
        res.status(201).json(response)

    } catch (err) {
        console.log("Error : Not Authorized")
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
