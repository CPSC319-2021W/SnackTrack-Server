import { Router } from 'express'
import { getSuggestions } from './controller.js'

const router = Router()

router.get('/', getSuggestions)

export default router
