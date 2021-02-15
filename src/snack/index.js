import { Router } from 'express'
import { addSnack } from './controller'

const router = Router()

router.post('/', addSnack)

export default router