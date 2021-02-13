import { Router } from 'express'
import { addUser, getUser } from './controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)

export default router
