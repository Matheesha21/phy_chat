
import { Router } from 'express';
import { getHalls } from '../controllers/dataController.js';

const router = Router();

router.get('/', getHalls);

export default router;