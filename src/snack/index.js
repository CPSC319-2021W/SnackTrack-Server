import { Router } from 'express'
import { addSnack, getSnacks, putSnacks } from './controller.js'

const router = Router()

router.post('/', addSnack)
router.put('/:snack_id', putSnacks)
router.get('/', getSnacks)

export default router