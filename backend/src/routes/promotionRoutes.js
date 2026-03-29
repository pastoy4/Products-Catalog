const express = require('express');
const router = express.Router();
const {
    getPromotions,
    getPromotion,
    createPromotion,
    updatePromotion,
    deletePromotion,
} = require('../controllers/promotionController');
const auth = require('../middleware/auth');

// Public
router.get('/', getPromotions);
router.get('/:id', getPromotion);

// Admin (protected)
router.post('/', auth, createPromotion);
router.put('/:id', auth, updatePromotion);
router.delete('/:id', auth, deletePromotion);

module.exports = router;

