import { Router } from 'express'
import { addSnackBatches, getSnackBatches } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, isAdmin, addSnackBatches)
router.get('/', getSnackBatches)

export default router
