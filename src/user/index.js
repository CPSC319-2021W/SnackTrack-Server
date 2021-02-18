import { Router } from 'express'
import { addUser, getUser, getTransactions } from './controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)
router.get('/:userId/transactions', getTransactions)

export default router
