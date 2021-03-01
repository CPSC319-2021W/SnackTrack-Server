import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { authenticateJWT } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, addUser)
router.get('/:userId', authenticateJWT, getUser)
router.get('/:userId/transactions', authenticateJWT, getUserTransactions)
router.get('/:userId/transactions/:transactionId', authenticateJWT, getUserTransaction)
router.get('/:userId/payments/', authenticateJWT, getUserPayments)

export default router
