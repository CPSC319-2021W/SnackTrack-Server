import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { authenticateJWT, checkPermission } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, addUser)
router.get('/:userId', authenticateJWT, checkPermission, getUser)
router.get('/:userId/transactions', authenticateJWT, checkPermission, getUserTransactions)
router.get('/:userId/transactions/:transactionId', authenticateJWT, checkPermission, getUserTransaction)
router.get('/:userId/payments/', authenticateJWT, checkPermission, getUserPayments)

export default router
