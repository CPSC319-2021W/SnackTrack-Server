import { Router } from 'express'
import { addTransaction, getTransactions } from "./controller"

const router = Router()

router.get('/transactions', getTransactions)

export default router
