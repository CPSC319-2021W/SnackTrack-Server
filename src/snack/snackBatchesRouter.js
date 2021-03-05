import { Router } from 'express'
import { addSnackBatches } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', authenticateJWT, isAdmin, addSnackBatches)

export default router