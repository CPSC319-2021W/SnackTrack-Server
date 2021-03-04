import { Router } from 'express'
import { getSuggestions } from './controller.js'
import { authenticateJWT, isAdmin } from '../auth/controller.js'

const router = Router()

router.get('/', authenticateJWT, isAdmin, getSuggestions)

export default router
