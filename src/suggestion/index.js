import { Router } from 'express'
import { addSuggestion, getSuggestions, deleteSuggestions } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.post('/', addSuggestion)
router.get('/', authenticateJWT, isAdmin, getSuggestions)
router.delete('/', authenticateJWT, isAdmin, deleteSuggestions)

export default router
