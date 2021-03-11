import { Router } from 'express'
import { addTransaction, updateTransaction } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.put('/:transaction_id', authenticateJWT, isAdmin, updateTransaction)
router.post('/', addTransaction)

export default router
