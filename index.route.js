import { Router } from 'express'
import userRouter from './src/user/index.js'
import adminRouter from './src/admin/index.js'
import transactionRouter from './src/transaction/index.js'
import paymentRouter from './src/payment/index.js'
import snackRouter from './src/snack/index.js'
import snackBatchRouter from './src/snack/snackBatchesRouter.js'

const router = Router()

router.use('/admins', adminRouter)
router.use('/users', userRouter)
router.use('/transactions', transactionRouter)
router.use('/payments', paymentRouter)
router.use('/snacks', snackRouter)
router.use('/snack_batches', snackBatchRouter)

export default router
