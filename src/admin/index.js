import { Router } from 'express'
import { addAdmin, getAdmin } from './controller.js'

const router = Router()

router.post('/', addAdmin)
router.get('/:userId', getAdmin)

export default router
