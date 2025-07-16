import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/payment', updatePaymentStatus);

export default router;