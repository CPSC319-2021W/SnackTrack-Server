import { Router } from 'express'
import {addSnackBatches, getSnackBatches} from './controller.js'

const router = Router()

router.post('/', addSnackBatches)
router.get('/', getSnackBatches)

export default router