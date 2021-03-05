import { Router } from 'express'
import { verifyAndCreateToken } from './controller.js'

const router = Router()

router.post('/', verifyAndCreateToken)

export default router
