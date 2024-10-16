const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc Place an order
// @route POST /api/orders
// @access Private (Customer)
const placeOrder = async (req, res) => {
    const { products } = req.body;

    // Validate products
    if (!products || !Array.isArray(products) || products.length === 0) {
        console.error('Validation Error: No products selected for the order');
        return res.status(400).json({ message: 'No products selected for the order' });
    }

    try {
        // Log the incoming products
        console.log('Incoming products:', JSON.stringify(products, null, 2));

        // Check if all products exist and have enough stock
        const productIds = products.map(p => p.product);
        console.log('Product IDs for lookup:', productIds);

        const foundProducts = await Product.find({ _id: { $in: productIds } });
        console.log('Found Products:', JSON.stringify(foundProducts, null, 2));

        // Validate if all requested products exist
        if (foundProducts.length !== products.length) {
            console.error('Validation Error: Some products are not available');
            return res.status(400).json({ message: 'Some products are not available' });
        }

        // Validate stock levels
        for (let i = 0; i < products.length; i++) {
            const orderProduct = products[i];
            const storeProduct = foundProducts.find(p => p._id.equals(orderProduct.product));

            if (storeProduct.stock < orderProduct.quantity) {
                console.error(`Insufficient stock for product "${storeProduct.name}". Requested: ${orderProduct.quantity}, Available: ${storeProduct.stock}`);
                return res.status(400).json({
                    message: `Product "${storeProduct.name}" has insufficient stock`,
                });
            }
        }

        // Deduct stock from each product
        for (let i = 0; i < products.length; i++) {
            const orderProduct = products[i];
            const storeProduct = foundProducts.find(p => p._id.equals(orderProduct.product));
            storeProduct.stock -= orderProduct.quantity;

            // Log stock deduction
            console.log(`Deducting ${orderProduct.quantity} from product "${storeProduct.name}". New stock: ${storeProduct.stock}`);
            await storeProduct.save();
        }

        // Create the order
        const order = await Order.create({
            user: req.user._id,
            products: products.map(p => ({
                product: new mongoose.Types.ObjectId(p.product), // Use 'new' if necessary
                quantity: p.quantity,
            })),
            status: 'Pending',
        });

        console.log("Order created successfully:", JSON.stringify(order, null, 2)); // Log the created order
        res.status(201).json(order);

    } catch (error) {
        console.error('Error placing order:', error);  // Log the error
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};



// @desc Get all orders (Admin only)
// @route GET /api/orders
// @access Private (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('products.product', 'name price');

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// @desc Get logged in user's orders
// @route GET /api/orders/myorders
// @access Private (Customer)
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price');

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
};

// @desc Update order status (Admin only)
// @route PUT /api/orders/:id/status
// @access Private (Admin)
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered'];

    // Validate status
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status
        order.status = status;
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

module.exports = { placeOrder, getAllOrders, getUserOrders, updateOrderStatus };
