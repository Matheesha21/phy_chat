
import { Router } from 'express';
import { getLectures } from '../controllers/dataController.js';

const router = Router();

router.get('/', getLectures);

export default router;