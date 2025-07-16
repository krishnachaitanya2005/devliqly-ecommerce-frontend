import express from 'express';
import {
  getCategories,
  getCategory,
  getCategoryBySlug,
  getSubcategories
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);
router.get('/:id/subcategories', getSubcategories);

export default router;