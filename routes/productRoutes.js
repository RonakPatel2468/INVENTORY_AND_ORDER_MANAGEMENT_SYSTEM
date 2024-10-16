const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route GET /api/products
// @desc Get all products (for browsing)
// @access Public
router.get('/getall', getAllProducts);

// @route GET /api/products/:id
// @desc Get product by ID
// @access Public
router.get('/:id', getProductById);

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post('/create', protect, admin, createProduct);

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;



