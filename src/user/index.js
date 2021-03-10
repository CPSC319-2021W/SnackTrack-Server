import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions, getPendingOrders } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { checkPermission } from '../auth/controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:user_id', checkPermission, getUser)
router.get('/:user_id/transactions', checkPermission, getUserTransactions)
router.get('/:user_id/transactions/:transaction_id', checkPermission, getUserTransaction)
router.get('/:user_id/payments/', checkPermission, getUserPayments)
router.get('/:user_id/pendingOrders/', checkPermission, getPendingOrders)

export default router
