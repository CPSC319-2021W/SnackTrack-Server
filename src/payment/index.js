import { Router } from 'express'
import { addPayment, getPayments } from './controller.js'

const router = Router()

router.post('/', addPayment)
router.get('/', getPayments)

export default router
