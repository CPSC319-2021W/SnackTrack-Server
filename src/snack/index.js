import { Router } from 'express'
import { addSnack, getSnacks, putSnacks, deleteSnacks } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()


router.post('/', authenticateJWT, isAdmin, addSnack)
router.put('/:snack_id', authenticateJWT, isAdmin, putSnacks)
router.get('/', getSnacks)
router.delete('/:snack_id', authenticateJWT, isAdmin, deleteSnacks)

export default router