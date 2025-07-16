import { Category } from '../models/Category.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const { includeInactive = false } = req.query;
  
  const query = includeInactive === 'true' ? {} : { isActive: true };
  
  const categories = await Category.find(query)
    .sort('sortOrder name');

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ 
    slug: req.params.slug,
    isActive: true 
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
export const getSubcategories = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  const activeSubcategories = category.subcategories.filter(sub => sub.isActive);

  res.status(200).json({
    success: true,
    data: activeSubcategories
  });
});