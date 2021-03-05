import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions, getPendingOrders } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { checkPermission } from '../auth/controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', checkPermission, getUser)
router.get('/:userId/transactions', checkPermission, getUserTransactions)
router.get('/:userId/transactions/:transactionId', checkPermission, getUserTransaction)
router.get('/:userId/payments/', checkPermission, getUserPayments)
router.get('/:userId/pendingOrders/', checkPermission, getPendingOrders)

export default router
