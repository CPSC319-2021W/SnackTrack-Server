import { db } from '../db/index.js'
import { errorCode } from '../util/error.js'

const Users = db.users

export const addUser = async (req, res) => {
  try {
    const user = req.body
    const result = await Users.create(user)
    return res.status(201).json(result)
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
    return res.status(500).json({ error: err.message })
  }
}

export const getUsersCommon = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['user_id', 'username', 'first_name', 'last_name', 'image_uri']
    })
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
    const result = await Users.update({ is_active: false }, { where: { user_id } })
    if (!result[0]) {
      return res.status(404).json({ error: 'user_id does not exist in the users table' })
    }
    await Users.destroy({ where: { user_id } })
    const response = await Users.findByPk(user_id, { paranoid: false })
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
