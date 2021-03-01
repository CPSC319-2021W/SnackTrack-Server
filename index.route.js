import { Router } from 'express'
import userRouter from './src/user/index.js'
import transactionRouter from './src/transaction/index.js'
import paymentRouter from './src/payment/index.js'
import snackRouter from './src/snack/index.js'
import snackBatchRouter from './src/snack/snackBatchesRouter.js'
import authRouter from './src/auth/index.js'

const router = Router()

router.use('/users', userRouter)
router.use('/transactions', transactionRouter)
router.use('/payments', paymentRouter)
router.use('/snacks', snackRouter)
router.use('/snack_batches', snackBatchRouter)
router.use('/authenticate', authRouter)

export default router
