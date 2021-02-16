import { Router } from 'express'
import userRouter from './src/user/index.js'
import adminRouter from './src/admin/index.js'
import transactionRouter from './src/transaction/index.js'
import snackRouter from './src/snack/index.js'

const router = Router()

router.use('admins', adminRouter)
router.use('users', userRouter)
router.use('transactions', transactionRouter)
router.use('snacks', snackRouter)

export default router