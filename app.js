import express from 'express'
import dotenv from 'dotenv'
// import cors from 'cors'
import router from './index.route.js'
dotenv.config()

const app = express()

app.set('port', process.env.PORT)
// app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/api/v1/', router)


export default app
