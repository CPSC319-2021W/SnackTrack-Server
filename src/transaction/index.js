import { Router } from 'express'
import { addTransaction, getTransactions } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', addTransaction)
router.get('/', authenticateJWT, isAdmin, getTransactions)

export default router
