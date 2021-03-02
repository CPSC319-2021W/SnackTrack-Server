import { Router } from 'express'
import { addSnack, getSnacks } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, isAdmin, addSnack)
router.get('/', getSnacks)

export default router