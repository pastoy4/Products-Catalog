const Slide = require('../models/Slide');
const cloudinary = require('../config/cloudinary');

// @desc    Get all active slides (public)
// @route   GET /api/slides
exports.getSlides = async (req, res, next) => {
    try {
        const slides = await Slide.find({ active: true }).sort({ order: 1 });
        res.json({ success: true, data: slides });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all slides (admin)
// @route   GET /api/slides/all
exports.getAllSlides = async (req, res, next) => {
    try {
        const slides = await Slide.find().sort({ order: 1 });
        res.json({ success: true, data: slides });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single slide
// @route   GET /api/slides/:id
exports.getSlide = async (req, res, next) => {
    try {
        const slide = await Slide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        res.json({ success: true, data: slide });
    } catch (error) {
        next(error);
    }
};

// @desc    Create slide (admin)
// @route   POST /api/slides
exports.createSlide = async (req, res, next) => {
    try {
        const slide = await Slide.create(req.body);
        res.status(201).json({ success: true, data: slide });
    } catch (error) {
        next(error);
    }
};

// @desc    Update slide (admin)
// @route   PUT /api/slides/:id
exports.updateSlide = async (req, res, next) => {
    try {
        const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!slide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }
        res.json({ success: true, data: slide });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete slide (admin)
// @route   DELETE /api/slides/:id
exports.deleteSlide = async (req, res, next) => {
    try {
        const slide = await Slide.findById(req.params.id);
        if (!slide) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }

        // Delete image from Cloudinary if exists
        if (slide.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(slide.imagePublicId);
            } catch (cloudErr) {
                console.error('Cloudinary delete error:', cloudErr.message);
            }
        }

        await Slide.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Slide deleted' });
    } catch (error) {
        next(error);
    }
};
