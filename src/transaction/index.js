import { Router } from 'express'
import { addTransaction } from './controller.js'

const router = Router()

router.post('/', addTransaction)

export default router
