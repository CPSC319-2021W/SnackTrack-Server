import { Router } from 'express'
import { addUser, getUser } from './controller.js'
import { getUserTransaction, getUserTransactions } from '../transaction/controller.js'
import { getUserPayments } from '../payment/controller.js'

const router = Router()

router.post('/', addUser)
router.get('/:userId', getUser)
router.get('/:userId/transactions', getUserTransactions)
router.get('/:userId/transactions/:transactionId', getUserTransaction)
router.get('/:userId/payments/', getUserPayments)

export default router
