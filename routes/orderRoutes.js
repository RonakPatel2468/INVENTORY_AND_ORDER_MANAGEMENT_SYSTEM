const express = require('express');
const { placeOrder, getAllOrders, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route POST /api/orders
// @desc Place an order
// @access Private (Customer)
router.post('/placeOrder', protect, placeOrder);

// @route GET /api/orders/myorders
// @desc Get logged-in user's orders
// @access Private (Customer)
router.get('/myorders', protect, getUserOrders);

// @route GET /api/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get('/getall', protect, admin, getAllOrders);

// @route PUT /api/orders/:id/status
// @desc Update order status (Admin only)
// @access Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
