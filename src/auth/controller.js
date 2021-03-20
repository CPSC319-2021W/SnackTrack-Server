import { db } from '../db/index.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

const { sign, verify } = jwt
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const clientId = process.env.CLIENT
const client = new OAuth2Client(clientId)
const Users = db.users 

export const verifyAndCreateToken = async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.headers.authorization.split(' ')[1],
      audience: clientId,
    })
    const payload = ticket.getPayload()
    let user = await Users.findOne({ where: { email_address: payload.email } })
    if (!user) {
      const randomInt = Math.floor((Math.random() * 1000) + 1)
      const username = payload.given_name + payload.family_name + randomInt.toString()
      const newUser = {
        username: username,
        first_name: payload.given_name,
        last_name: payload.family_name,
        email_address: payload.email,
        image_uri: payload.picture,
      }
      const result = await Users.create(newUser)
      user = result.toJSON()
    } else if (user.is_active === false && user.deleted_at !== null) { // TODO: ensure this works as intended
      await user.restore()
      user = await user.update({ is_active: true })
    }
    const accessToken = sign(
      { user_id: user.user_id,  is_admin: user.is_admin }, 
      accessTokenSecret, 
      { expiresIn: '30 days' })
    return res.json({ accessToken, user })
  } catch (err) {
    return res.status(403).json({ error: err.message })
  }   
}

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Unable to authenticate JWT token' })
      }
      req.user = user
      next()
    })
  } else {
    return res.status(401).json({ error: 'You are not authorized.' })
  }
}

export const isAdmin = (req, res, next) => {
  const { is_admin } = req.user
  if(!is_admin) {
    return res.status(403).json({ error: 'You are not an admin.' })
  }
  next()
}

export const checkPermission = (req, res, next) => {
  const user_id = req.params.user_id
  const { user_id: currUserId, is_admin } = req.user
  if (!is_admin && parseInt(user_id) !== currUserId) {
    return res.status(403).json({ error: 'You are not an admin nor yourself.' })
  }
  next()
}
