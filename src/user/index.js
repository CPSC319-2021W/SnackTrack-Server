import { Router } from 'express'
import { addUser, getUser } from './controller.js'

const router = Router()

router.post('/', addUser)
router.post('/:userID', getUser)

export default router
