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
    let user = await Users.findOne({ where: { email_address: payload.email }})
    if (!user){
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
    }
    const accessToken = sign(
      { user_id: user.user_id,  is_admin: user.is_admin }, 
      accessTokenSecret, 
      { expiresIn: '30 days' })
    res.json({ accessToken, user })
  } catch (err) {
    return res.status(403).send({ Error: err.message })
  }   
}

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).send({ Error: 'Unable to authenticate JWT token' })
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401).send({ Error: 'Not authorized' })
  }
}

export const isAdmin = (req, res, next) => {
  const { is_admin } = req.user
  if(!is_admin) {
    return res.sendStatus(403)
  }
  next()
}

export const checkPermission = (req, res, next) => {
  const userId = req.params.userId
  const { user_id, is_admin } = req.user
  if (!is_admin && user_id !== parseInt(userId)) {
    return res.sendStatus(403)
  }
  next()
}