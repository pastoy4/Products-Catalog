const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
            default: '',
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        ctaLabel: {
            type: String,
            trim: true,
            default: '',
        },
        ctaUrl: {
            type: String,
            trim: true,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
            index: true,
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);

