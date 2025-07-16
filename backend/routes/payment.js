import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
  getPaymentDetails,
  refundPayment,
  codOrder
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-order', authenticate, createRazorpayOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/:paymentId', authenticate, getPaymentDetails);
router.post('/refund', authenticate, authorize('admin'), 
refundPayment);
router.post("/cod",authenticate, codOrder);


export default router;