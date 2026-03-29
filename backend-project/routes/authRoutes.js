import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a user (default role: user)
 */
router.post('/register', registerUser);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user and receive JWT token
 */
router.post('/login', loginUser);

export default router;