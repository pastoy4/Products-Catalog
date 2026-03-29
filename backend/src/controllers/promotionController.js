const Promotion = require('../models/Promotion');

// @desc    Get promotions (public; filter by active flag)
// @route   GET /api/promotions
exports.getPromotions = async (req, res, next) => {
    try {
        const { active } = req.query;
        const filter = {};
        if (typeof active !== 'undefined') {
            filter.active = active === 'true';
        }
        const promos = await Promotion.find(filter).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: promos.length, data: promos });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/promotions/:id
exports.getPromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findById(req.params.id);
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, data: promo });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/promotions (admin)
exports.createPromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.create(req.body);
        res.status(201).json({ success: true, data: promo });
    } catch (error) {
        next(error);
    }
};

// @route   PUT /api/promotions/:id (admin)
exports.updatePromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, data: promo });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/promotions/:id (admin)
exports.deletePromotion = async (req, res, next) => {
    try {
        const promo = await Promotion.findByIdAndDelete(req.params.id);
        if (!promo) return res.status(404).json({ success: false, message: 'Promotion not found' });
        res.json({ success: true, message: 'Promotion deleted' });
    } catch (error) {
        next(error);
    }
};

