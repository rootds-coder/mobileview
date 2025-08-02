const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

// Import database and middleware
const db = require('./config/database');
const { sessionConfig } = require('./middleware/auth');

// Import MongoDB models
const User = require('./models/User');
const Post = require('./models/Post');
const Gallery = require('./models/Gallery');
const YouTubeVideo = require('./models/YouTubeVideo');
const Service = require('./models/Service');
const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session middleware
app.use(session(sessionConfig));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware to exclude admin routes from default layout
app.use((req, res, next) => {
    if (req.path.startsWith('/sunny')) {
        res.locals.layout = false;
    }
    next();
});

// Sample data for posts
const posts = [
  {
    id: 1,
    title: "Latest iPhone Repair Techniques",
    content: "We've mastered the latest iPhone repair techniques including screen replacement, battery replacement, and water damage repair.",
    image: "/images/post1.jpg",
    date: "2024-01-15",
    author: "Mobile Doctor Team"
  },
  {
    id: 2,
    title: "Android Flashing Guide",
    content: "Complete guide to safely flash Android devices with custom ROMs and recovery tools.",
    image: "/images/post2.jpg",
    date: "2024-01-10",
    author: "Tech Expert"
  },
  {
    id: 3,
    title: "5G Network Optimization",
    content: "Tips and tricks to optimize your device for 5G networks and improve connectivity.",
    image: "/images/post3.jpg",
    date: "2024-01-05",
    author: "Network Specialist"
  }
];

// Sample gallery data
const gallery = [
  { id: 1, title: "iPhone Screen Repair", image: "/images/gallery1.jpg", category: "repair" },
  { id: 2, title: "Android Flashing", image: "/images/gallery2.jpg", category: "flashing" },
  { id: 3, title: "Battery Replacement", image: "/images/gallery3.jpg", category: "repair" },
  { id: 4, title: "Water Damage Repair", image: "/images/gallery4.jpg", category: "repair" },
  { id: 5, title: "Custom ROM Installation", image: "/images/gallery5.jpg", category: "flashing" },
  { id: 6, title: "Hardware Upgrades", image: "/images/gallery6.jpg", category: "upgrade" }
];

// Real YouTube videos from Realmobiledoctor channel
const youtubeVideos = [
  {
    id: 1,
    title: "iPhone Screen Replacement Tutorial - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_IPHONE_SCREEN_VIDEO_ID",
    description: "Professional iPhone screen replacement tutorial by Sunny Gujjar - Step by step guide"
  },
  {
    id: 2,
    title: "Android Flashing Complete Guide - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_ANDROID_FLASHING_VIDEO_ID", 
    description: "Complete Android flashing and custom ROM installation guide by Mobile Doctor"
  },
  {
    id: 3,
    title: "Mobile Repair Tips & Tricks - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_REPAIR_TIPS_VIDEO_ID",
    description: "Expert mobile repair tips and tricks from Sunny Gujjar"
  }
];

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3);
    const gallery = await Gallery.find().sort({ createdAt: -1 }).limit(8);
    
    res.render('index', {
      title: 'Mobile Doctor - Professional Mobile Repair & Services',
      posts: posts,
      gallery: gallery
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('index', {
      title: 'Mobile Doctor - Professional Mobile Repair & Services',
      posts: [],
      gallery: []
    });
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ createdAt: -1 });
    res.render('services', {
      title: 'Our Services - Mobile Doctor',
      services: services
    });
  } catch (error) {
    console.error('Services page error:', error);
    res.render('services', {
      title: 'Our Services - Mobile Doctor',
      services: []
    });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    res.render('posts', {
      title: 'Blog Posts - Mobile Doctor',
      posts: posts
    });
  } catch (error) {
    console.error('Posts page error:', error);
    res.render('posts', {
      title: 'Blog Posts - Mobile Doctor',
      posts: []
    });
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, status: 'published' });
    if (!post) {
      return res.status(404).render('404', { title: 'Post Not Found' });
    }
    res.render('post-detail', {
      title: post.title + ' - Mobile Doctor',
      post: post,
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  } catch (error) {
    console.error('Post detail error:', error);
    res.status(404).render('404', { title: 'Post Not Found' });
  }
});

app.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.render('gallery', {
      title: 'Gallery - Mobile Doctor',
      gallery: gallery
    });
  } catch (error) {
    console.error('Gallery page error:', error);
    res.render('gallery', {
      title: 'Gallery - Mobile Doctor',
      gallery: []
    });
  }
});

app.get('/youtube', async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    res.render('youtube', {
      title: 'YouTube Videos - Mobile Doctor',
      videos: videos
    });
  } catch (error) {
    console.error('YouTube page error:', error);
    res.render('youtube', {
      title: 'YouTube Videos - Mobile Doctor',
      videos: []
    });
  }
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Mobile Doctor'
  });
});

// Import admin routes
const adminRoutes = require('./routes/admin');

// Admin routes (standalone pages, no layout)
app.use('/sunny', adminRoutes);

// API Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('API posts error:', error);
    res.json([]);
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    console.error('API gallery error:', error);
    res.json([]);
  }
});

app.get('/api/youtube', async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('API videos error:', error);
    res.json([]);
  }
});

// Import contact routes
const contactRoutes = require('./routes/contact');

// Contact routes
app.use('/contact', contactRoutes);

// Contact form submission (legacy route for backward compatibility)
app.post('/contact', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, device_type, service_needed, message } = req.body;
    
    // Save to MongoDB
    const contactMessage = new ContactMessage({
      first_name,
      last_name,
      email,
      phone,
      device_type,
      service_needed,
      message
    });
    await contactMessage.save();
    
    // Send emails using new email service
    const emailService = require('./config/email');
    const customerData = {
      firstName: first_name,
      lastName: last_name,
      email: email,
      phone: phone,
      service: service_needed || device_type || 'General Inquiry',
      message: message
    };
    
    const emailResult = await emailService.sendContactEmails(customerData);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Mobile Doctor website is live!');
=======
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

// Import database and middleware
const db = require('./config/database');
const { sessionConfig } = require('./middleware/auth');

// Import MongoDB models
const User = require('./models/User');
const Post = require('./models/Post');
const Gallery = require('./models/Gallery');
const YouTubeVideo = require('./models/YouTubeVideo');
const Service = require('./models/Service');
const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session middleware
app.use(session(sessionConfig));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware to exclude admin routes from default layout
app.use((req, res, next) => {
    if (req.path.startsWith('/sunny')) {
        res.locals.layout = false;
    }
    next();
});

// Sample data for posts
const posts = [
  {
    id: 1,
    title: "Latest iPhone Repair Techniques",
    content: "We've mastered the latest iPhone repair techniques including screen replacement, battery replacement, and water damage repair.",
    image: "/images/post1.jpg",
    date: "2024-01-15",
    author: "Mobile Doctor Team"
  },
  {
    id: 2,
    title: "Android Flashing Guide",
    content: "Complete guide to safely flash Android devices with custom ROMs and recovery tools.",
    image: "/images/post2.jpg",
    date: "2024-01-10",
    author: "Tech Expert"
  },
  {
    id: 3,
    title: "5G Network Optimization",
    content: "Tips and tricks to optimize your device for 5G networks and improve connectivity.",
    image: "/images/post3.jpg",
    date: "2024-01-05",
    author: "Network Specialist"
  }
];

// Sample gallery data
const gallery = [
  { id: 1, title: "iPhone Screen Repair", image: "/images/gallery1.jpg", category: "repair" },
  { id: 2, title: "Android Flashing", image: "/images/gallery2.jpg", category: "flashing" },
  { id: 3, title: "Battery Replacement", image: "/images/gallery3.jpg", category: "repair" },
  { id: 4, title: "Water Damage Repair", image: "/images/gallery4.jpg", category: "repair" },
  { id: 5, title: "Custom ROM Installation", image: "/images/gallery5.jpg", category: "flashing" },
  { id: 6, title: "Hardware Upgrades", image: "/images/gallery6.jpg", category: "upgrade" }
];

// Real YouTube videos from Realmobiledoctor channel
const youtubeVideos = [
  {
    id: 1,
    title: "iPhone Screen Replacement Tutorial - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_IPHONE_SCREEN_VIDEO_ID",
    description: "Professional iPhone screen replacement tutorial by Sunny Gujjar - Step by step guide"
  },
  {
    id: 2,
    title: "Android Flashing Complete Guide - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_ANDROID_FLASHING_VIDEO_ID", 
    description: "Complete Android flashing and custom ROM installation guide by Mobile Doctor"
  },
  {
    id: 3,
    title: "Mobile Repair Tips & Tricks - Mobile Doctor",
    videoId: "REPLACE_WITH_YOUR_REPAIR_TIPS_VIDEO_ID",
    description: "Expert mobile repair tips and tricks from Sunny Gujjar"
  }
];

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 }).limit(3);
    const gallery = await Gallery.find().sort({ createdAt: -1 }).limit(8);
    
    res.render('index', {
      title: 'Mobile Doctor - Professional Mobile Repair & Services',
      posts: posts,
      gallery: gallery
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('index', {
      title: 'Mobile Doctor - Professional Mobile Repair & Services',
      posts: [],
      gallery: []
    });
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ createdAt: -1 });
    res.render('services', {
      title: 'Our Services - Mobile Doctor',
      services: services
    });
  } catch (error) {
    console.error('Services page error:', error);
    res.render('services', {
      title: 'Our Services - Mobile Doctor',
      services: []
    });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    res.render('posts', {
      title: 'Blog Posts - Mobile Doctor',
      posts: posts
    });
  } catch (error) {
    console.error('Posts page error:', error);
    res.render('posts', {
      title: 'Blog Posts - Mobile Doctor',
      posts: []
    });
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, status: 'published' });
    if (!post) {
      return res.status(404).render('404', { title: 'Post Not Found' });
    }
    res.render('post-detail', {
      title: post.title + ' - Mobile Doctor',
      post: post,
      currentUrl: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  } catch (error) {
    console.error('Post detail error:', error);
    res.status(404).render('404', { title: 'Post Not Found' });
  }
});

app.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.render('gallery', {
      title: 'Gallery - Mobile Doctor',
      gallery: gallery
    });
  } catch (error) {
    console.error('Gallery page error:', error);
    res.render('gallery', {
      title: 'Gallery - Mobile Doctor',
      gallery: []
    });
  }
});

app.get('/youtube', async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    res.render('youtube', {
      title: 'YouTube Videos - Mobile Doctor',
      videos: videos
    });
  } catch (error) {
    console.error('YouTube page error:', error);
    res.render('youtube', {
      title: 'YouTube Videos - Mobile Doctor',
      videos: []
    });
  }
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Mobile Doctor'
  });
});

// Import admin routes
const adminRoutes = require('./routes/admin');

// Admin routes (standalone pages, no layout)
app.use('/sunny', adminRoutes);

// API Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('API posts error:', error);
    res.json([]);
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    console.error('API gallery error:', error);
    res.json([]);
  }
});

app.get('/api/youtube', async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('API videos error:', error);
    res.json([]);
  }
});

// Import contact routes
const contactRoutes = require('./routes/contact');

// Contact routes
app.use('/contact', contactRoutes);

// Contact form submission (legacy route for backward compatibility)
app.post('/contact', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, device_type, service_needed, message } = req.body;
    
    // Save to MongoDB
    const contactMessage = new ContactMessage({
      first_name,
      last_name,
      email,
      phone,
      device_type,
      service_needed,
      message
    });
    await contactMessage.save();
    
    // Send emails using new email service
    const emailService = require('./config/email');
    const customerData = {
      firstName: first_name,
      lastName: last_name,
      email: email,
      phone: phone,
      service: service_needed || device_type || 'General Inquiry',
      message: message
    };
    
    const emailResult = await emailService.sendContactEmails(customerData);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Mobile Doctor website is live!');
>>>>>>> b9d16a623ece2f6f508bb2fd0c703d18c4c331c1
}); 