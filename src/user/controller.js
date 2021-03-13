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
    return res.status(400).json({ error: err.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const isFetchAll = req.query.email_address === undefined
    const email_address = req.query.email_address
    const where = isFetchAll ? {} : { email_address }
    const users = await Users.findAll({ where })
    return res.status(200).json({ users })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const response = await Users.findByPk(user_id)
    if (!response) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const [found, result] = await Users.update({ is_active: false }, { where: { user_id }, returning: true })
    const [data] = result.map(elem => elem.get())
    if (!found) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    await Users.destroy({ where: { user_id } })
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
