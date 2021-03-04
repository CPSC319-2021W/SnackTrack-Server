import { Router } from 'express'
import { addSnack, deleteSnacks, getSnacks } from './controller.js'

const router = Router()

router.post('/', addSnack)
router.get('/', getSnacks)
router.delete('/:snack_id', deleteSnacks)

export default router