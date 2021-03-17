import { Router } from 'express'
import { addPayment } from './controller.js'

const router = Router()

router.post('/', addPayment)

export default router
