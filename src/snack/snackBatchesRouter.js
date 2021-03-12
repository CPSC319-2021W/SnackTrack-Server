import { Router } from 'express'
import { addSnackBatches, deleteSnackBatches, getSnackBatches } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, isAdmin, addSnackBatches)
router.get('/', getSnackBatches)
router.delete('/:snack_batch_id', authenticateJWT, isAdmin, deleteSnackBatches)

export default router
