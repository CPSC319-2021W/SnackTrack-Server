import { Router } from 'express'
import { addPayment, addPaymentAll } from './controller.js'

const router = Router()

router.post('/all', addPaymentAll)
router.post('/', addPayment)

export default router
