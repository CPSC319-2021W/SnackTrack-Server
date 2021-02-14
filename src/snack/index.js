import { Router } from 'express'
import { getSnacks } from "./controller.js"

const router = Router()

router.get('/', getSnacks)

export default router