const mongoose = require('mongoose');

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
}

// Connect to MongoDB
const connectDatabase = async () => {
    try {
        console.log('Connecting to MongoDB database...');
        
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ Successfully connected to MongoDB database');
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

// Initialize database
connectDatabase();

module.exports = mongoose; 