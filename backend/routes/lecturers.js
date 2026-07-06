
import { Router } from 'express';
import { getLecturers } from '../controllers/dataController.js';

const router = Router();

router.get('/', getLecturers);

export default router;