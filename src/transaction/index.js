import { Router } from 'express'
import { addTransaction, getTransactions } from './controller.js'
import { authenticateJWT } from '../auth/controller.js'

const router = Router()

router.post('/', addTransaction)
router.get('/', authenticateJWT, getTransactions)

export default router
