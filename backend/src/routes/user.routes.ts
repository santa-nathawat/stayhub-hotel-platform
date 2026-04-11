import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.put('/profile', authenticate, userController.updateProfile);

export default router;
