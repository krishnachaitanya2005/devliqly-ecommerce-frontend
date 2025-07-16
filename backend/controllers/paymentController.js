import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid amount'
    });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Payment order creation failed'
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required payment details'
    });
  }

  try {
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order with payment details
    const order = await Order.findById(orderId);

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
    order.paymentInfo.razorpayOrderId = razorpay_order_id;
    order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
    order.paymentInfo.razorpaySignature = razorpay_signature;
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// @desc    Handle Razorpay webhook
// @route   POST /api/payment/webhook
// @access  Public
export const handleWebhook = asyncHandler(async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSignature || !webhookSecret) {
    return res.status(400).json({
      success: false,
      message: 'Webhook signature missing'
    });
  }

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const { event, payload } = req.body;

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// Helper function to handle payment captured
const handlePaymentCaptured = async (payment) => {
  try {
    const order = await Order.findOne({
      'paymentInfo.razorpayOrderId': payment.order_id
    });

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'confirmed';
      order.paymentInfo.razorpayPaymentId = payment.id;
      await order.save();
      
      console.log(`Payment captured for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Helper function to handle payment failed
const handlePaymentFailed = async (payment) => {
  try {
    const order = await Order.findOne({
      'paymentInfo.razorpayOrderId': payment.order_id
    });

    if (order) {
      order.status = 'payment_failed';
      await order.save();
      
      console.log(`Payment failed for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Helper function to handle order paid
const handleOrderPaid = async (orderData) => {
  try {
    const order = await Order.findOne({
      'paymentInfo.razorpayOrderId': orderData.id
    });

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();
      
      console.log(`Order paid: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details'
    });
  }
});

// @desc    Refund payment
// @route   POST /api/payment/refund
// @access  Private/Admin
export const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  if (!paymentId) {
    return res.status(400).json({
      success: false,
      message: 'Payment ID is required'
    });
  }

  try {
    const refundOptions = {
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
      notes: {
        reason: reason || 'Refund requested by admin'
      }
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund failed'
    });
  }
});
// @desc    cash on delivery
// @route   POST /api/payment/cod
// @access  Public
export const codOrder = asyncHandler(async (req, res) => {
  try {
    const {
      orderItems,
      userId,
      deliveryAddress,
      subTotal,
      totalAmount
    } = req.body;

    if (!orderItems || !deliveryAddress || !userId || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const order = await Order.create({
      user: userId,
      orderItems,
      deliveryAddress,
      razorpayOrderId: `COD-${Date.now()}`, // Dummy ID for schema requirement
      paymentStatus: "pending",
      isCOD: true,
      subTotal,
      totalAmount,
      status: "processing"
    });

    res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      order
    });
  } catch (error) {
    console.error("COD order creation failed:", error);
    res.status(500).json({ success: false, message: "COD order failed" });
  }
});