import { db } from '../db/index.js'
import { getPagination, getPagingData } from '../util/pagination.js'

// Reference: PostgreSQL error code documentation
// https://www.postgresql.org/docs/8.2/errcodes-appendix.html
// 23505 = UNIQUE_VIOLATION
const UNIQUE_VIOLATION = '23505'
const NOT_FOUND = '404'

const Users = db.users 
const Admins = db.admins
const Payments = db.payments

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
        // TODO : Add logic checking if the requesting user is authorized (Ticket: SNAK-78)
        const userId = req.params.userId

        // TODO: Optimization (Ticket: SNAK-93)
        const resultFromDB = await Users.findByPk(userId)
        if (resultFromDB == null) throw new Error(404)
        const response = resultFromDB.toJSON()

        const isAdmin = await Admins.findOne({ 
            where: { user_id : userId }
        })
        response.is_admin = Boolean(isAdmin) ?? false

        return res.status(200).json(response)
    } catch (err) {
        if (err.message === NOT_FOUND) return res.status(404).send({ Error: "userid doesn't exist in the users table" })
        return res.status(500).send({ Error: err.message })
    }
}

export const getUserPayments = async(req, res) => {
  try {
    const userId = req.params.userId
    const user = await Users.findByPk(userId)
    if (user == null) throw new Error(404)

    const { page, size } = req.query
    const { limit, offset } = getPagination(page, size)
    const userPayments = await Payments.findAndCountAll({
      limit,
      offset,
      where: { user_id : userId }
    })

    const response = getPagingData(userPayments, page, limit, 'payments')
    res.status(200).send(response)
  } catch (err) {
    // TODO : handle 401 (Not authorized) case in SNAK-123
    if (err.message === NOT_FOUND) return res.status(404).send({ Error : "user_id doesn't exist in the users table" })
    return res.status(500).send({ Error : 'Internal Server Error'})
  }
}
