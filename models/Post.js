const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    image_url: {
        type: String,
        default: null
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'draft'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema); 