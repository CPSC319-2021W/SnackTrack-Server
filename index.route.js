import { Router } from 'express'
import userRouter from './src/user/index.js'
import transactionRouter from './src/transaction/index.js'
import paymentRouter from './src/payment/index.js'
import snackRouter from './src/snack/index.js'
import snackBatchRouter from './src/snack/snackBatchesRouter.js'
import authRouter from './src/auth/index.js'
import suggestionRouter from './src/suggestion/index.js'
import { authenticateJWT, isAdmin } from './src/auth/controller.js'

const router = Router()

router.use('/users', authenticateJWT, userRouter)
router.use('/transactions', transactionRouter)
router.use('/payments', authenticateJWT, paymentRouter)
router.use('/snacks', snackRouter)
router.use('/snack_batches', authenticateJWT, isAdmin, snackBatchRouter)
router.use('/authenticate', authRouter)
router.use('/suggestions', suggestionRouter)

export default router
