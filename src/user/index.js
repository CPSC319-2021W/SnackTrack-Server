import { Router } from 'express'
import { addUser, getUser, getUserTransaction, getUserTransactions, getUserPayments } from './controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)
router.get('/:userId/transactions', getUserTransactions)
router.get('/:userId/transactions/:transactionId', getUserTransaction)
router.get('/:userId/payments/', getUserPayments)

export default router
