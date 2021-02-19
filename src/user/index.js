import { Router } from 'express'
import { addUser, getUser, getUserTransaction, getUserTransactions } from './controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)
router.get('/:userId/transactions', getUserTransactions)
router.get('/:userId/transactions/:transactionId', getUserTransaction)

export default router
