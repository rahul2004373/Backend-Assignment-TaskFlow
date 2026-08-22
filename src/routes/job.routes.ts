import { Router } from 'express';
import { jobController } from '../controllers/job.controller.ts';
import { authenticate } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.get('/:id', jobController.getStatus);

export default router;
