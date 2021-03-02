import { Router } from 'express'
import { addSuggestion, getSuggestions } from './controller.js'

const router = Router()

router.post('/', addSuggestion)
router.get('/', getSuggestions)

export default router
