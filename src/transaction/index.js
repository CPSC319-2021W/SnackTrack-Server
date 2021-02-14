import { Router } from 'express'
import { getTransactions } from "./controller.js"

const router = Router()

router.get('/', getTransactions)

export default router
