import { db } from '../db/index.js'

// Reference: PostgreSQL error code documentation
// https://www.postgresql.org/docs/8.2/errcodes-appendix.html
// 23505 = UNIQUE_VIOLATION
const UNIQUE_VIOLATION = '23505'
const NOT_FOUND = '404'

const Users = db.users 

export const addUser = async (req, res) => {
  try {
    const user = req.body
    const result = await Users.create(user)
    res.status(201).send(result)
  } catch (err) {
    if (err.parent.code === UNIQUE_VIOLATION) {
      return res.status(409).send({ Error: err.message })
    }
    return res.status(400).send({ Error: err.message })
  }
}

export const getUser = async(req, res) => {
  try {
    const userId = req.params.userId
    // TODO: Optimization (Ticket: SNAK-93)
    const resultFromDB = await Users.findByPk(userId)
    if (resultFromDB === null) throw new Error(404)
    const response = resultFromDB.toJSON()

    return res.status(200).json(response)
  } catch (err) {
    if (err.message === NOT_FOUND) return res.status(404).send({ Error: "userid doesn't exist in the users table" })
    return res.status(500).send({ Error: err.message })
  }
}
