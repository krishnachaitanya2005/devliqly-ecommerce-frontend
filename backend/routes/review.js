import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  reportReview,
  markReviewHelpful
} from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/product/:productId', optionalAuth, getProductReviews);
router.get('/user', authenticate, getUserReviews);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/report', authenticate, reportReview);
router.post('/:id/helpful', authenticate, markReviewHelpful);

export default router;