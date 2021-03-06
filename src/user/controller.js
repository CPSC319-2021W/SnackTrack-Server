import { db } from '../db/index.js'

// Reference: PostgreSQL error code documentation
// https://www.postgresql.org/docs/8.2/errcodes-appendix.html
// 23505 = UNIQUE_VIOLATION
const UNIQUE_VIOLATION = '23505'
const Users = db.users 

export const addUser = async (req, res) => {
  try {
    const user = req.body
    const result = await Users.create(user)
    return res.status(201).json(result)
  } catch (err) {
    if (err.parent.code === UNIQUE_VIOLATION) {
      return res.status(409).json({ error: 'User is already exist.' })
    }
    return res.status(400).json({ error: 'User was not created!' })
  }
}

export const getUser = async (req, res) => {
  try {
    const user_id = req.params.user_id
    // TODO: Optimization (Ticket: SNAK-93)
    const response = await Users.findByPk(user_id)
    if (!response) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
