import { Router } from 'express'
import { addSnack } from './controller.js'

const router = Router()

router.post('/', addSnack)

export default router
