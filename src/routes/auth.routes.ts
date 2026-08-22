import { Router } from 'express';
import { authController } from '../controllers/auth.controller.ts';
import { validate } from '../middleware/validate.middleware.ts';
import { registerSchema, loginSchema, refreshSchema } from '../schema/auth.schema.ts';
import { authRateLimiter } from '../middleware/rate-limit.middleware.ts';

const router = Router();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);

export default router;
