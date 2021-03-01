import { Router } from 'express'
import { verifyGAuth } from './controller.js'

const router = Router()

router.post('/', verifyGAuth)

export default router
