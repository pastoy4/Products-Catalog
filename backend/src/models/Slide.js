const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Slide title is required'],
            trim: true,
        },
        subtitle: {
            type: String,
            default: '',
        },
        badge: {
            type: String,
            default: '',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        imagePublicId: {
            type: String,
            default: '',
        },
        bgGradient: {
            type: String,
            default: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #1a1a3e 100%)',
        },
        order: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Slide', slideSchema);
