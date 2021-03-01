import { Router } from 'express'
import { addPayment, getPayments } from './controller.js'
import { authenticateJWT } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, addPayment)
router.get('/', authenticateJWT, getPayments)

export default router
