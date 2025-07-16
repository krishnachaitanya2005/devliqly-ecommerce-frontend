import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentInfo,
    itemsPrice,
    shippingPrice = 0,
    taxPrice = 0,
    totalPrice
  } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Validate stock availability and prepare order items
  const orderItems = [];
  let calculatedItemsPrice = 0;

  for (const cartItem of cart.items) {
    const product = cartItem.product;
    
    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: `Product ${product?.name || 'Unknown'} is no longer available`
      });
    }

    if (product.stock < cartItem.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
      });
    }

    const itemPrice = product.discountPrice || product.price;
    calculatedItemsPrice += itemPrice * cartItem.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.secure_url || '',
      price: itemPrice,
      quantity: cartItem.quantity
    });
  }

  // Validate prices
  if (Math.abs(calculatedItemsPrice - itemsPrice) > 0.01) {
    return res.status(400).json({
      success: false,
      message: 'Price mismatch. Please refresh and try again.'
    });
  }

  // Create order
  const order = new Order({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice: calculatedItemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: calculatedItemsPrice + shippingPrice + taxPrice
  });

  await order.save();

  // Update product stock and sold count
  for (const cartItem of cart.items) {
    await Product.findByIdAndUpdate(cartItem.product._id, {
      $inc: {
        stock: -cartItem.quantity,
        sold: cartItem.quantity
      }
    });
  }

  // Clear user's cart
  cart.items = [];
  await cart.save();

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(req.user.email, order);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { user: req.user._id };
  
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('items.product', 'name images');

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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images')
    .populate('user', 'name email phone');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel order with status: ${order.status}`
    });
  }

  // Update order status
  order.status = 'cancelled';
  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
        sold: -item.quantity
      }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId, signature } = req.body;
  
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Update payment info
  order.paymentInfo.razorpayPaymentId = paymentId;
  order.paymentInfo.razorpaySignature = signature;
  order.isPaid = true;
  order.paidAt = new Date();
  order.status = 'confirmed';

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment updated successfully',
    data: order
  });
});