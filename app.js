import express from 'express'
import cookieParser from 'cookie-parser'
import userRouter from './src/user/index.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/user', userRouter)
app.use(cookieParser());

export default app



