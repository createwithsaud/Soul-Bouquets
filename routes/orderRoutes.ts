import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

let razorpayClient: Razorpay | null = null;

function getRazorpay() {
  if (!razorpayClient) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (key_id && key_secret) {
      razorpayClient = new Razorpay({
        key_id,
        key_secret,
      });
    }
  }
  return razorpayClient;
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (Should be Admin in production)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Returning empty orders array.');
      return res.json([]);
    }
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public (Should be Admin in production)
router.put('/:id/status', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected. Cannot create order.' });
    }
    const { orderItems, user, totalPrice, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        orderItems,
        user,
        totalPrice,
        paymentMethod: paymentMethod || 'COD',
        status: 'Pending',
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/:id/pay
// @access  Public
router.post('/:id/pay', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const rzp = getRazorpay();
    if (!rzp) {
      res.status(500).json({ message: 'Razorpay keys not configured in environment' });
      return;
    }

    const options = {
      amount: Math.round(order.totalPrice * 100), // amount in smallest currency unit (paise)
      currency: 'USD', // Change to INR if needed
      receipt: order._id.toString(),
    };

    const razorpayOrder = await rzp.orders.create(options);
    res.json(razorpayOrder);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Server error while creating Razorpay order' });
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/:id/verify
// @access  Public
router.post('/:id/verify', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      res.status(500).json({ message: 'Razorpay keys not configured' });
      return;
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      };

      const updatedOrder = await order.save();
      res.json({ message: 'Payment verified successfully', order: updatedOrder });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
});

export default router;
