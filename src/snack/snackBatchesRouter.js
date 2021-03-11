import { Router } from 'express'
import { addSnackBatches, getSnackBatches, putSnackBatches } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, isAdmin, addSnackBatches)
router.put('/:snack_batch_id', authenticateJWT, isAdmin, putSnackBatches)
router.get('/', getSnackBatches)

export default router
