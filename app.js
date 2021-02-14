import express from 'express'
import userRouter from './src/user/index.js'
import paymentRouter from './src/payment/index.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/users', userRouter)
app.use('/payments', paymentRouter)

export default app
