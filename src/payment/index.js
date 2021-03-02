import { Router } from 'express'
import { addPayment, getPayments } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, addPayment)
router.get('/', authenticateJWT, isAdmin, getPayments)

export default router
