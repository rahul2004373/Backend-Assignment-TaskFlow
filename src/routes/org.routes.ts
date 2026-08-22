import { Router } from 'express';
import { orgController } from '../controllers/org.controller.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { createOrgSchema } from '../schema/org.schema.ts';
import { authenticate } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/', authenticate, validate(createOrgSchema), orgController.createOrganization);

export default router;
