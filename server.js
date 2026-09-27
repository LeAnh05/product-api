const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();

app.use(express.json());

// Ket noi MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });

// CREATE - Them san pham
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// READ - Lay danh sach tat ca san pham
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ - Lay mot san pham theo pid
app.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findOne({
            pid: req.params.pid
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE - Cap nhat san pham theo pid
app.put('/products/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { pid: req.params.pid },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE - Xoa san pham theo pid
app.delete('/products/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({
            pid: req.params.pid
        });

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Kiem tra API
app.get('/', (req, res) => {
    res.send('Product API is running');
});

// Healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK'
    });
});

// Khoi dong server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});