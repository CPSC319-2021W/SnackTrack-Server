import { Router } from 'express'
import { addUser, getUser, getUserTransactions } from './controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)
router.get('/:userId/transactions', getUserTransactions)

export default router
