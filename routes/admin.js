const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { requireAuth, requireAdmin, requireEditor } = require('../middleware/auth');

// Import MongoDB models
const User = require('../models/User');
const Post = require('../models/Post');
const Gallery = require('../models/Gallery');
const YouTubeVideo = require('../models/YouTubeVideo');
const Service = require('../models/Service');
const ContactMessage = require('../models/ContactMessage');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
        }
    }
});

// Admin Login Page (standalone, no layout)
router.get('/login', (req, res) => {
    res.render('admin/login', { 
        title: 'Admin Login',
        layout: false // Ensure no layout is used
    });
});

// Admin Login Process
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.render('admin/login', { 
                title: 'Admin Login',
                error: 'Invalid username or password',
                layout: false
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.render('admin/login', { 
                title: 'Admin Login',
                error: 'Invalid username or password',
                layout: false
            });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.redirect('/sunny/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', { 
            title: 'Admin Login',
            error: 'Login failed. Please try again.',
            layout: false
        });
    }
});

// Admin Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/sunny/login');
});

// Admin Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        // Get statistics
        const posts = await Post.countDocuments();
        const gallery = await Gallery.countDocuments();
        const videos = await YouTubeVideo.countDocuments();
        const messages = await ContactMessage.countDocuments({ status: 'new' });
        const services = await Service.countDocuments();

        // Get recent posts for dashboard
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

        // Get recent messages for dashboard
        const recentMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user,
            currentPage: 'dashboard',
            stats: {
                posts: posts,
                gallery: gallery,
                videos: videos,
                messages: messages,
                services: services
            },
            recentPosts: recentPosts,
            recentMessages: recentMessages,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin/error', {
            title: 'Error',
            message: 'Failed to load dashboard',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Posts Management
router.get('/posts', requireEditor, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('admin/posts', {
            title: 'Manage Posts',
            user: req.session.user,
            currentPage: 'posts',
            posts,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Posts error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load posts',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Add Post
router.get('/posts/add', requireEditor, (req, res) => {
    res.render('admin/post-form', {
        title: 'Add New Post',
        user: req.session.user,
        currentPage: 'posts',
        post: {},
        layout: 'admin/layout'
    });
});

// Create Post
router.post('/posts', requireEditor, upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, status, image_url } = req.body;
        let image = req.file && req.file.size > 0 ? `/uploads/${req.file.filename}` : null;
        
        const post = new Post({
            title,
            content,
            image,
            image_url: image_url && image_url.trim() !== '' ? image_url.trim() : null,
            author,
            status
        });
        await post.save();
        res.redirect('/sunny/posts');
    } catch (error) {
        console.error('Create post error:', error);
        res.render('admin/error', {
            title: 'Error',
            message: 'Failed to create post',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Edit Post
router.get('/posts/edit/:id', requireEditor, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.redirect('/sunny/posts');
        }
        
        res.render('admin/post-form', {
            title: 'Edit Post',
            user: req.session.user,
            currentPage: 'posts',
            post: post,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Edit post error:', error);
        res.redirect('/sunny/posts');
    }
});

// Update Post
router.post('/posts/:id', requireEditor, upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, status, image_url, current_image } = req.body;
        let image = current_image;
        if (req.file && req.file.size > 0) {
            image = `/uploads/${req.file.filename}`;
        }
        
        await Post.findByIdAndUpdate(req.params.id, {
            title,
            content,
            image,
            image_url: image_url && image_url.trim() !== '' ? image_url.trim() : null,
            author,
            status
        });
        res.redirect('/sunny/posts');
    } catch (error) {
        console.error('Update post error:', error);
        res.render('admin/error', {
            title: 'Error',
            message: 'Failed to update post',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Delete Post
router.post('/posts/delete/:id', requireEditor, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/posts');
    } catch (error) {
        console.error('Delete post error:', error);
        res.redirect('/sunny/posts');
    }
});

// Gallery Management
router.get('/gallery', requireEditor, async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });
        res.render('admin/gallery', {
            title: 'Manage Gallery',
            user: req.session.user,
            currentPage: 'gallery',
            gallery,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Gallery error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load gallery',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Add Gallery Item
router.post('/gallery', requireEditor, upload.single('image'), async (req, res) => {
    try {
        const { title, category, description, image_url } = req.body;
        
        let image;
        
        // Check if file was uploaded
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        } else if (image_url && image_url.trim()) {
            // Use image URL if provided
            image = image_url.trim();
        } else {
            return res.render('admin/error', { 
                title: 'Error', 
                message: 'Please either upload an image file or provide an image URL.',
                currentPage: '',
                user: req.session.user || { username: 'Admin' },
                layout: 'admin/layout'
            });
        }

        const galleryItem = new Gallery({
            title,
            image,
            category,
            description
        });
        await galleryItem.save();

        res.redirect('/sunny/gallery');
    } catch (error) {
        console.error('Add gallery error:', error);
        
        // Handle multer errors specifically
        let errorMessage = 'Failed to add gallery item. Please make sure you provided a valid image file or URL.';
        if (error.message && error.message.includes('Only image files')) {
            errorMessage = 'Invalid file type. Please upload only JPEG, JPG, PNG, or GIF images.';
        } else if (error.message && error.message.includes('File too large')) {
            errorMessage = 'File size too large. Please upload an image smaller than 5MB.';
        }
        
        res.render('admin/error', { 
            title: 'Error', 
            message: errorMessage,
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Delete Gallery Item
router.post('/gallery/delete/:id', requireEditor, async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/gallery');
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.redirect('/sunny/gallery');
    }
});

// YouTube Videos Management
router.get('/videos', requireEditor, async (req, res) => {
    try {
        const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
        res.render('admin/videos', {
            title: 'Manage YouTube Videos',
            user: req.session.user,
            currentPage: 'videos',
            videos,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Videos error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load videos',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Add YouTube Video
router.post('/videos', requireEditor, async (req, res) => {
    try {
        const { title, video_id, description, category } = req.body;

        const video = new YouTubeVideo({
            title,
            video_id,
            description,
            category
        });
        await video.save();

        res.redirect('/sunny/videos');
    } catch (error) {
        console.error('Add video error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to add video',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Delete YouTube Video
router.post('/videos/delete/:id', requireEditor, async (req, res) => {
    try {
        await YouTubeVideo.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/videos');
    } catch (error) {
        console.error('Delete video error:', error);
        res.redirect('/sunny/videos');
    }
});

// Contact Messages
router.get('/messages', requireEditor, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.render('admin/messages', {
            title: 'Manage Messages',
            user: req.session.user,
            currentPage: 'messages',
            messages,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Messages error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load messages',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Mark Message as Read
router.post('/messages/read/:id', requireEditor, async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.redirect('/sunny/messages');
    } catch (error) {
        console.error('Mark read error:', error);
        res.redirect('/sunny/messages');
    }
});

// Mark Message as Read via API
router.post('/messages/read-api/:id', requireEditor, async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.json({ success: true });
    } catch (error) {
        console.error('Mark read API error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Send Email Reply via SMTP
router.post('/send-email-reply', requireEditor, async (req, res) => {
    try {
        const { to, subject, message, customerName, includeSignature } = req.body;
        
        // Import email service
        const emailService = require('../config/email');
        
        // Prepare the email content
        let emailContent = message;
        
        if (includeSignature) {
            emailContent += '\n\n---\nBest regards,\nSunny Gujjar\nMobile Doctor\n+91 99929 19688\n81, Ganesh Market, Bhamashah Nagar, Hisar, Haryana 125001';
        }
        
        // Send the email using your SMTP server
        const emailResult = await emailService.sendDirectEmail({
            to: to,
            subject: subject,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>')
        });
        
        if (emailResult.success) {
            // Mark message as replied in database
            await ContactMessage.updateMany(
                { email: to, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
                { status: 'replied' }
            );
            
            res.json({ success: true, messageId: emailResult.messageId });
        } else {
            res.json({ success: false, error: emailResult.error });
        }
    } catch (error) {
        console.error('Send email reply error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Delete Message
router.post('/messages/delete/:id', requireEditor, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/messages');
    } catch (error) {
        console.error('Delete message error:', error);
        res.redirect('/sunny/messages');
    }
});

// Services Management
router.get('/services', requireEditor, async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.render('admin/services', {
            title: 'Manage Services',
            user: req.session.user,
            currentPage: 'services',
            services,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error('Services error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load services',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Add Service
router.post('/services', requireEditor, async (req, res) => {
    try {
        const { name, description, icon, price } = req.body;

        const service = new Service({
            name,
            description,
            icon,
            price
        });
        await service.save();

        res.redirect('/sunny/services');
    } catch (error) {
        console.error('Add service error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to add service',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Edit Service
router.post('/services/edit/:id', requireEditor, async (req, res) => {
    try {
        const { name, description, price, icon, status } = req.body;
        await Service.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price,
            icon,
            status
        });
        res.redirect('/sunny/services');
    } catch (error) {
        console.error('Edit service error:', error);
        res.render('admin/error', {
            title: 'Error',
            message: 'Failed to update service',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Delete Service
router.post('/services/delete/:id', requireEditor, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/services');
    } catch (error) {
        console.error('Delete service error:', error);
        res.redirect('/sunny/services');
    }
});

// Prevent 404 on GET /sunny/services/edit/:id by redirecting to the service list
router.get('/services/edit/:id', requireEditor, (req, res) => {
    res.redirect('/sunny/services');
});

// User Management (Admin only)
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render('admin/users', {
            title: 'Manage Users',
            user: req.session.user,
            currentPage: 'users',
            users,
            layout: 'admin/layout'
        });
    } catch (error) {   
        console.error('Users error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to load users',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Add User
router.post('/users', requireAdmin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const user = new User({
            username,
            email,
            password,
            role
        });
        await user.save();

        res.redirect('/sunny/users');
    } catch (error) {
        console.error('Add user error:', error);
        res.render('admin/error', { 
            title: 'Error', 
            message: 'Failed to add user',
            currentPage: '',
            user: req.session.user || { username: 'Admin' },
            layout: 'admin/layout'
        });
    }
});

// Delete User
router.post('/users/delete/:id', requireAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/sunny/users');
    } catch (error) {
        console.error('Delete user error:', error);
        res.redirect('/sunny/users');
    }
});

module.exports = router; 