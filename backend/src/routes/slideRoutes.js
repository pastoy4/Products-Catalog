const express = require('express');
const router = express.Router();
const {
    getSlides,
    getAllSlides,
    getSlide,
    createSlide,
    updateSlide,
    deleteSlide,
} = require('../controllers/slideController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getSlides);

// Protected routes (admin only)
router.get('/all', auth, getAllSlides);
router.get('/:id', auth, getSlide);
router.post('/', auth, createSlide);
router.put('/:id', auth, updateSlide);
router.delete('/:id', auth, deleteSlide);

module.exports = router;
