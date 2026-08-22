import { Router } from 'express';
import { projectController } from '../controllers/project.controller.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { createProjectSchema, updateProjectSchema } from '../schema/project.schema.ts';
import { authenticate } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);
router.get('/:id/dashboard', projectController.getDashboard);

export default router;
