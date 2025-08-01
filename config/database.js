const mongoose = require('mongoose');

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hpc1842:b2ahikct6i@cluster0.ozqt3py.mongodb.net/mobiledoctor?retryWrites=true&w=majority&appName=Cluster0';

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