const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
}

// Import models
const User = require('./models/User');
const Post = require('./models/Post');
const Gallery = require('./models/Gallery');
const YouTubeVideo = require('./models/YouTubeVideo');
const Service = require('./models/Service');
const ContactMessage = require('./models/ContactMessage');

async function setupMongoDB() {
    try {
        console.log('🔧 Setting up Mobile Doctor MongoDB Database...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Successfully connected to MongoDB database');

        // Create default admin user
        console.log('\n👤 Creating default admin user...');
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                username: 'admin',
                password: 'admin123',
                email: 'admin@mobiledoctor.com',
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Default admin user created (username: admin, password: admin123)');
        } else {
            console.log('✅ Admin user already exists');
        }

        // Insert sample data
        console.log('\n📝 Inserting sample data...');

        // Sample posts
        const postsCount = await Post.countDocuments();
        if (postsCount === 0) {
            const samplePosts = [
                {
                    title: 'Latest iPhone Repair Techniques',
                    content: 'We\'ve mastered the latest iPhone repair techniques including screen replacement, battery replacement, and water damage repair.',
                    author: 'Mobile Doctor Team',
                    status: 'published'
                },
                {
                    title: 'Android Flashing Guide',
                    content: 'Complete guide to safely flash Android devices with custom ROMs and recovery tools.',
                    author: 'Tech Expert',
                    status: 'published'
                },
                {
                    title: '5G Network Optimization',
                    content: 'Tips and tricks to optimize your device for 5G networks and improve connectivity.',
                    author: 'Network Specialist',
                    status: 'published'
                }
            ];
            await Post.insertMany(samplePosts);
            console.log('✅ Sample posts inserted');
        } else {
            console.log('✅ Posts already exist');
        }

        // Sample gallery items
        const galleryCount = await Gallery.countDocuments();
        if (galleryCount === 0) {
            const sampleGallery = [
                {
                    title: 'iPhone Screen Repair',
                    image: '/images/gallery1.jpg',
                    category: 'repair',
                    description: 'Professional iPhone screen replacement service'
                },
                {
                    title: 'Android Flashing',
                    image: '/images/gallery2.jpg',
                    category: 'flashing',
                    description: 'Android device flashing and custom ROM installation'
                },
                {
                    title: 'Battery Replacement',
                    image: '/images/gallery3.jpg',
                    category: 'repair',
                    description: 'Mobile battery replacement service'
                },
                {
                    title: 'Water Damage Repair',
                    image: '/images/gallery4.jpg',
                    category: 'repair',
                    description: 'Water damage repair and recovery'
                },
                {
                    title: 'Custom ROM Installation',
                    image: '/images/gallery5.jpg',
                    category: 'flashing',
                    description: 'Custom ROM installation service'
                },
                {
                    title: 'Hardware Upgrades',
                    image: '/images/gallery6.jpg',
                    category: 'upgrade',
                    description: 'Mobile hardware upgrade services'
                }
            ];
            await Gallery.insertMany(sampleGallery);
            console.log('✅ Sample gallery items inserted');
        } else {
            console.log('✅ Gallery items already exist');
        }

        // Sample YouTube videos
        const videosCount = await YouTubeVideo.countDocuments();
        if (videosCount === 0) {
            const sampleVideos = [
                {
                    title: 'iPhone Screen Replacement Tutorial - Mobile Doctor',
                    video_id: 'REPLACE_WITH_YOUR_IPHONE_SCREEN_VIDEO_ID',
                    description: 'Professional iPhone screen replacement tutorial by Sunny Gujjar - Step by step guide',
                    category: 'repair'
                },
                {
                    title: 'Android Flashing Complete Guide - Mobile Doctor',
                    video_id: 'REPLACE_WITH_YOUR_ANDROID_FLASHING_VIDEO_ID',
                    description: 'Complete Android flashing and custom ROM installation guide by Mobile Doctor',
                    category: 'flashing'
                },
                {
                    title: 'Mobile Repair Tips & Tricks - Mobile Doctor',
                    video_id: 'REPLACE_WITH_YOUR_REPAIR_TIPS_VIDEO_ID',
                    description: 'Expert mobile repair tips and tricks from Sunny Gujjar',
                    category: 'tips'
                }
            ];
            await YouTubeVideo.insertMany(sampleVideos);
            console.log('✅ Sample YouTube videos inserted');
        } else {
            console.log('✅ YouTube videos already exist');
        }

        // Sample services
        const servicesCount = await Service.countDocuments();
        if (servicesCount === 0) {
            const sampleServices = [
                {
                    name: 'Screen Replacement',
                    description: 'Professional screen replacement for all mobile devices',
                    icon: 'fas fa-mobile-alt',
                    price: 1500.00,
                    status: 'active'
                },
                {
                    name: 'Battery Replacement',
                    description: 'Genuine battery replacement with warranty',
                    icon: 'fas fa-battery-full',
                    price: 800.00,
                    status: 'active'
                },
                {
                    name: 'Water Damage Repair',
                    description: 'Expert water damage repair and recovery',
                    icon: 'fas fa-tint',
                    price: 1200.00,
                    status: 'active'
                },
                {
                    name: 'Software Flashing',
                    description: 'Android and iOS software flashing services',
                    icon: 'fas fa-download',
                    price: 500.00,
                    status: 'active'
                },
                {
                    name: 'Unlocking Service',
                    description: 'Network unlocking for all mobile devices',
                    icon: 'fas fa-unlock',
                    price: 300.00,
                    status: 'active'
                },
                {
                    name: 'Hardware Repair',
                    description: 'Complete hardware repair and replacement',
                    icon: 'fas fa-tools',
                    price: 2000.00,
                    status: 'active'
                }
            ];
            await Service.insertMany(sampleServices);
            console.log('✅ Sample services inserted');
        } else {
            console.log('✅ Services already exist');
        }

        // Show summary
        console.log('\n📊 Database Summary:');
        const users = await User.countDocuments();
        const posts = await Post.countDocuments();
        const gallery = await Gallery.countDocuments();
        const videos = await YouTubeVideo.countDocuments();
        const services = await Service.countDocuments();
        const messages = await ContactMessage.countDocuments();

        console.log(`👥 Users: ${users}`);
        console.log(`📝 Posts: ${posts}`);
        console.log(`🖼️ Gallery Items: ${gallery}`);
        console.log(`📺 YouTube Videos: ${videos}`);
        console.log(`🔧 Services: ${services}`);
        console.log(`💬 Messages: ${messages}`);

        console.log('\n🎉 MongoDB setup completed successfully!');
        console.log('\n🔗 Next steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Visit admin panel: http://localhost:3000/sunny/login');
        console.log('3. Login with: admin / admin123');

    } catch (error) {
        console.error('❌ Error setting up MongoDB:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Check your MongoDB connection string');
        console.log('2. Verify your network connection');
        console.log('3. Make sure MongoDB Atlas is accessible');
    } finally {
        await mongoose.disconnect();
    }
}

// Run the setup
setupMongoDB(); 