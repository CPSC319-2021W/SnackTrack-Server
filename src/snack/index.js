import { Router } from 'express'
import { addSnack, getSnacks, putSnacks } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()


router.post('/', authenticateJWT, isAdmin, addSnack)
router.put('/:snack_id', putSnacks)
router.get('/', getSnacks)

export default router