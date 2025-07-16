import express from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts
} from '../controllers/productController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/related', getRelatedProducts);

export default router;