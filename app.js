import express from 'express'
import userRouter from './src/user/index.js'
import snackRouter from './src/snack/index.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/users', userRouter)
app.use('/snack', snackRouter)

export default app



