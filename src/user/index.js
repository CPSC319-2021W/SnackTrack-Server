import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'
import { checkPermission } from '../auth/controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', checkPermission, getUser)
router.get('/:userId/transactions', checkPermission, getUserTransactions)
router.get('/:userId/transactions/:transactionId', checkPermission, getUserTransaction)
router.get('/:userId/payments/', checkPermission, getUserPayments)

export default router
