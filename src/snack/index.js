import { Router } from 'express';
import { addSnack, getSnacks } from "./controller.js";

const router = Router();

router.post('/', addSnack);
router.get('/', getSnacks);

export default router;