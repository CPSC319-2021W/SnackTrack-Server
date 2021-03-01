import { Router } from 'express'
import { addSnack, getSnacks } from './controller.js'
import { authenticateJWT } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, addSnack)
router.get('/', authenticateJWT, getSnacks)

export default router