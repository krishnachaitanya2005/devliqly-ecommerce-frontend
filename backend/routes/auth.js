import express from 'express';
import {
  signup,
  verifyOTP,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { otpLimiter, loginLimiter } from '../middlewares/rateLimiter.js';
import { 
  validate, 
  signupSchema, 
  loginSchema, 
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema 
} from '../validators/auth.js';

const router = express.Router();

router.post('/signup', otpLimiter, validate(signupSchema), signup);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;