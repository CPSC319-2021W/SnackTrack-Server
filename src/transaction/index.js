import { Router } from 'express'
import { addTransaction, getTransactions } from "./controller.js"

const router = Router()

router.post('/', addTransaction)
router.get('/', getTransactions)

export default router
