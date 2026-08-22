import { Router } from 'express';
import { taskController } from '../controllers/task.controller.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { createTaskSchema, updateTaskSchema, getTasksQuerySchema, assignTaskSchema } from '../schema/task.schema.ts';
import { authenticate } from '../middleware/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', validate(getTasksQuerySchema), taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);
router.post('/:id/assign', validate(assignTaskSchema), taskController.assignUser);
router.post('/:id/unassign', validate(assignTaskSchema), taskController.unassignUser);

export default router;
