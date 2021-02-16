import express from 'express'
import userRouter from './src/user/index.js'
import adminRouter from './src/admin/index.js'
import transactionRouter from './src/transaction/index.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/admins', adminRouter)
app.use('/users', userRouter)
app.use('/transactions', transactionRouter)

export default app
