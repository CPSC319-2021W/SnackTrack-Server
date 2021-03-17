import { Router } from 'express'
import { addSuggestion, getSuggestions } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', addSuggestion)
router.get('/', authenticateJWT, isAdmin, getSuggestions)

export default router
