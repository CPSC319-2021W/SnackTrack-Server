import express from 'express'
import cookieParser from 'cookie-parser'
import userRouter from './src/user/index.js'


const app = express()

app.set('port', '5050')
// TODO: update .env
// app.set('port', process.env.PORT)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/user', userRouter)
app.use(cookieParser());

export default app



