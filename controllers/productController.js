const Product = require('../models/productModel');

// Create a product
const createProduct = async (req, res) => {
    const { name, price, stock } = req.body;
    const product = await Product.create({ name, price, stock });
    res.status(201).json(product);
};

// Get all products
const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// Get a single product
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
