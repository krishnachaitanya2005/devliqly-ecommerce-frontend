import Product from '../models/Product.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    subcategory,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    search,
    featured,
    inStock
  } = req.query;

  // Build query
  let query = { isActive: true };

  // Category filter
  if (category) {
    query.category = category;
  }

  // Subcategory filter
  if (subcategory) {
    query.subcategory = subcategory;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured === 'true') {
    query.isFeatured = true;
  }

  // In stock filter
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Search filter
  if (search) {
    query.$text = { $search: search };
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort('-createdAt')
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const {
    page = 1,
    limit = 12,
    subcategory,
    minPrice,
    maxPrice,
    sort = '-createdAt'
  } = req.query;

  // Build query
  let query = { 
    category: categoryId, 
    isActive: true 
  };

  // Subcategory filter
  if (subcategory) {
    query.subcategory = subcategory;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const query = {
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
          { brand: { $regex: q, $options: 'i' } }
        ]
      }
    ]
  };

  const skip = (page - 1) * limit;
  
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { subcategory: product.subcategory },
      { tags: { $in: product.tags } }
    ],
    isActive: true
  })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .limit(8)
    .sort('-rating');

  res.status(200).json({
    success: true,
    data: relatedProducts
  });
});