import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(5);

  // Monthly sales data
  const monthlySales = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        sales: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Top selling products
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      recentOrders,
      monthlySales,
      topProducts
    }
  });
});

// PRODUCT MANAGEMENT
// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    subcategory,
    brand,
    specifications,
    tags,
    isFeatured
  } = req.body;

  // Handle image uploads
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.path, 'products');
        images.push({
          public_id: result.public_id,
          secure_url: result.secure_url
        });
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  }

  const product = new Product({
    name,
    description,
    price,
    discountPrice,
    images,
    stock,
    category,
    subcategory,
    brand,
    specifications: specifications ? JSON.parse(specifications) : [],
    tags: tags ? JSON.parse(tags) : [],
    isFeatured: isFeatured === 'true'
  });

  await product.save();
  await product.populate('category subcategory');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    subcategory,
    brand,
    specifications,
    tags,
    isFeatured,
    isActive,
    removeImages
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Handle image removal
  if (removeImages) {
    const imagesToRemove = JSON.parse(removeImages);
    for (const publicId of imagesToRemove) {
      try {
        await deleteFromCloudinary(publicId);
        product.images = product.images.filter(img => img.public_id !== publicId);
      } catch (error) {
        console.error('Image deletion failed:', error);
      }
    }
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const result = await uploadToCloudinary(file.path, 'products');
        product.images.push({
          public_id: result.public_id,
          secure_url: result.secure_url
        });
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discountPrice = discountPrice || product.discountPrice;
  product.stock = stock !== undefined ? stock : product.stock;
  product.category = category || product.category;
  product.subcategory = subcategory || product.subcategory;
  product.brand = brand || product.brand;
  product.specifications = specifications ? JSON.parse(specifications) : product.specifications;
  product.tags = tags ? JSON.parse(tags) : product.tags;
  product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured;
  product.isActive = isActive !== undefined ? isActive === 'true' : product.isActive;

  await product.save();
  await product.populate('category subcategory');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Delete product images from Cloudinary
  for (const image of product.images) {
    try {
      await deleteFromCloudinary(image.public_id);
    } catch (error) {
      console.error('Image deletion failed:', error);
    }
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// CATEGORY MANAGEMENT
// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, subcategories, sortOrder } = req.body;

  // Handle image upload
  let image = null;
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.path, 'categories');
      image = {
        public_id: result.public_id,
        secure_url: result.secure_url
      };
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }

  const category = new Category({
    name,
    description,
    image,
    subcategories: subcategories ? JSON.parse(subcategories) : [],
    sortOrder
  });

  await category.save();

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, subcategories, sortOrder, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Handle image upload
  if (req.file) {
    try {
      // Delete old image
      if (category.image && category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file.path, 'categories');
      category.image = {
        public_id: result.public_id,
        secure_url: result.secure_url
      };
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  }

  // Update category fields
  category.name = name || category.name;
  category.description = description || category.description;
  category.subcategories = subcategories ? JSON.parse(subcategories) : category.subcategories;
  category.sortOrder = sortOrder !== undefined ? sortOrder : category.sortOrder;
  category.isActive = isActive !== undefined ? isActive === 'true' : category.isActive;

  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with existing products'
    });
  }

  // Delete category image
  if (category.image && category.image.public_id) {
    try {
      await deleteFromCloudinary(category.image.public_id);
    } catch (error) {
      console.error('Image deletion failed:', error);
    }
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// ORDER MANAGEMENT
// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingInfo, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update order status
  order.status = status;

  // Update tracking info if provided
  if (trackingInfo) {
    order.trackingInfo = { ...order.trackingInfo, ...trackingInfo };
  }

  // Update delivery status
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  // Add to status history
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// USER MANAGEMENT
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  let query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Don't allow deleting admin users
  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete admin user'
    });
  }

  // Delete user avatar if exists
  if (user.avatar && user.avatar.public_id) {
    try {
      await deleteFromCloudinary(user.avatar.public_id);
    } catch (error) {
      console.error('Avatar deletion failed:', error);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});