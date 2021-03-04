import { Router } from 'express'
import { addPayment, getPayments } from './controller.js'
import { isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', addPayment)
router.get('/', isAdmin, getPayments)

export default router
