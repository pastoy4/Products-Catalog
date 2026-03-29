const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products (public)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const { search, category, sort } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category && category !== 'All') {
            filter.category = category;
        }

        let query = Product.find(filter);

        // Sorting
        if (sort === 'price_asc') query = query.sort({ price: 1 });
        else if (sort === 'price_desc') query = query.sort({ price: -1 });
        else if (sort === 'name') query = query.sort({ name: 1 });
        else query = query.sort({ createdAt: -1 });

        const products = await query;

        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product (public)
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete image from Cloudinary if exists
        if (product.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(product.imagePublicId);
            } catch (cloudErr) {
                console.error('Cloudinary delete error:', cloudErr.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get distinct categories
// @route   GET /api/products/categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk update stock quantities
// @route   PATCH /api/products/bulk-stock
exports.bulkUpdateStock = async (req, res, next) => {
    try {
        const { updates } = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ success: false, message: 'Updates array is required' });
        }

        const bulkOps = updates.map(({ id, stock }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { stock: Math.max(0, stock) } },
            },
        }));

        await Product.bulkWrite(bulkOps);
        res.json({ success: true, message: `Updated ${updates.length} products` });
    } catch (error) {
        next(error);
    }
};
