import { Router } from 'express'
import { addAdmin } from './controller.js'

const router = Router()

router.post('/', addAdmin)

export default router
