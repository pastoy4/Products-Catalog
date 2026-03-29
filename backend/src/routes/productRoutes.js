const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    bulkUpdateStock,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

// Public routes
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.patch('/bulk-stock', auth, bulkUpdateStock);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
