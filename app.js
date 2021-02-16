import express from 'express'
import userRouter from './src/user/index.js'
import adminRouter from './src/admin/index.js'
import transactionRouter from './src/transaction/index.js'
import snackRouter from './src/snack/index.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/api/v1/admins', adminRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/transactions', transactionRouter)
app.use('/api/v1/snacks', snackRouter)

export default app
