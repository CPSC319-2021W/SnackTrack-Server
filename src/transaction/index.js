import { Router } from 'express'
import { addTransaction, getTransactions } from "./controller"

const router = Router()

router.post('/transactions', addTransaction)
router.get('/transactions', getTransactions)

export default router
