import { Router } from 'express'
import { addSnackBatches } from './controller.js'

const router = Router()

router.post('/', addSnackBatches)

export default router