import { Router } from 'express'
import { addUser, deleteUser, getUser, getUsers, getUsersCommon, putUsers } from './controller.js'
import { getUserTransaction, getUserTransactions, getPendingOrders } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { authenticateJWT, checkPermission } from '../auth/controller.js'

const router = Router()

router.post('/', addUser)
router.put('/:user_id', authenticateJWT, checkPermission, putUsers)
router.get('/', authenticateJWT, checkPermission, getUsers)
router.get('/common', getUsersCommon)
router.get('/:user_id', authenticateJWT, checkPermission, getUser)
router.get('/:user_id/transactions', authenticateJWT, checkPermission, getUserTransactions)
router.get('/:user_id/transactions/:transaction_id', authenticateJWT, checkPermission, getUserTransaction)
router.get('/:user_id/payments/', authenticateJWT, checkPermission, getUserPayments)
router.get('/:user_id/pendingOrders/', authenticateJWT, checkPermission, getPendingOrders)
router.delete('/:user_id', authenticateJWT, checkPermission, deleteUser)

export default router
