const express = require('express');
const Product = require('../model/product');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Create Product
router.post('/', authenticateToken, async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: "Product details cannot be empty" });
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Aggregate: Count of products greater than price
router.get('/count/:price', async (req, res) => {
    try {
        const price = Number(req.params.price);
        const productCount = await Product.aggregate([
            { $match: { price: { $gt: price } } },
            { $count: "productCount" }
        ]);
        res.status(200).send(productCount);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Aggregate: Average price
router.get('/average-price', async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: "$price" }
                }
            }
        ]);
        const averagePrice = result.length > 0 ? result[0].averagePrice : 0;
        res.status(200).json({ averagePrice });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
