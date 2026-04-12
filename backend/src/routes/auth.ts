import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController';

const router = Router();

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

export default router;
