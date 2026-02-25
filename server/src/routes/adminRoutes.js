import { Router } from 'express';
import { unlockUser } from '../controllers/adminController.js';
import { clearLogs } from '../controllers/logController.js';

const router = Router();
router.post('/unlock', unlockUser);
router.post('/clear-logs', clearLogs);

export default router;
