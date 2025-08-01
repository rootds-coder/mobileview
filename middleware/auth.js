const session = require('express-session');

// Session configuration
const sessionConfig = {
    secret: 'mobiledoctor_secret_key_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/sunny/login');
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('admin/error', {
        title: 'Access Denied',
        message: 'You need admin privileges to access this page.'
    });
};

// Middleware to check if user is editor or admin
const requireEditor = (req, res, next) => {
    if (req.session && req.session.user && 
        (req.session.user.role === 'admin' || req.session.user.role === 'editor')) {
        return next();
    }
    res.status(403).render('admin/error', {
        title: 'Access Denied',
        message: 'You need editor privileges to access this page.'
    });
};

module.exports = {
    sessionConfig,
    requireAuth,
    requireAdmin,
    requireEditor
}; 