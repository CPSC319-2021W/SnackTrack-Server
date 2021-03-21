import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'

const Users = db.users
const instance = db.dbInstance
const NOT_FOUND = 'user_id is not found on the users table'

export const addUser = async (req, res) => {
  try {
    const user = req.body
    const result = await Users.create(user)
    return res.status(201).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const putUsers = async (req, res) => {
  try {
    const { balance, is_admin } = req.body
    const user_id = req.params.user_id
    if (balance === undefined && is_admin === undefined) {
      return res.status(200).json(await Users.findByPk(user_id))
    }
    const [found, result] = await Users.update({ balance, is_admin }, {
      where: { user_id }, returning: true, paranoid: false
    })
    const [data] = result.map(elem => elem.get())
    if (!found) {
      return res.status(404).json({ error: NOT_FOUND })
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
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
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const getUsersCommon = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['user_id', 'username', 'first_name', 'last_name', 'image_uri']
    })
    return res.status(200).json({ users })
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}


export const getUser = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const response = await Users.findByPk(user_id)
    if (!response) {
      return res.status(404).json({ error: NOT_FOUND })
    }
    return res.status(200).json(response)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await instance.transaction(async (t) => {
      const user_id = req.params.user_id
      const result = await Users.update({ is_active: false },
        { where: { user_id } }, { transaction: t })
      if (!result[0]) {
        return res.status(404).json({ error: NOT_FOUND })
      }
      await Users.destroy({ where: { user_id } }, { transaction: t })
      const response = await Users.findByPk(user_id, { paranoid: false })
      return response
    })
    return res.status(200).json(result)
  } catch (err) {
    return res.status(errorCode(err)).json({ error: err.message })
  }
}
