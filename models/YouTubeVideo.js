const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    video_id: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'general',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('YouTubeVideo', youtubeVideoSchema); 