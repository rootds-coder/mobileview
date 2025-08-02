# Mobile Doctor - Professional Mobile Repair & Services Website

A modern, responsive website for Mobile Doctor - a professional mobile repair and services business. Built with Node.js, Express, EJS, and MySQL.

## 🌟 Features

### **Frontend**
- 🎨 **Cyberpunk Theme** with neon colors and glassmorphism effects
- 📱 **Fully Responsive** design for all devices
- ⚡ **Fast Loading** with optimized assets
- 🎯 **SEO Optimized** with proper meta tags
- 🔍 **Search Functionality** for blog posts

### **Backend**
- 🔐 **Secure Admin Panel** with authentication
- 📧 **Email Integration** with SMTP server
- 📊 **Dynamic Content Management** (Posts, Gallery, Services, Videos)
- 💬 **Contact Form** with auto-reply functionality
- 📱 **WhatsApp Integration** for direct contact

### **Admin Panel**
- 📝 **Blog Management** - Create, edit, delete posts
- 🖼️ **Gallery Management** - Upload and manage images
- 🎥 **Video Management** - Add YouTube videos
- 🛠️ **Services Management** - Manage service offerings
- 💌 **Message Management** - View and reply to customer inquiries
- 👥 **User Management** - Admin and editor roles

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB Atlas (for production)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/rootds-coder/mobileview.git
cd mobileview
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
SMTP_HOST=mcom
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=00.net
SMTP_PASS=your_smtp_password
ADMIN_EMAIL=@gmail.com
PORT=3000
```

4. **Set up database**
```bash
node setup_database.js
```

5. **Start the server**
```bash
npm start
```

6. **Access the website**
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/sunny/login

## 📁 Project Structure

```
mobileview/
├── config/
│   ├── database.js          # Database configuration
│   └── email.js            # Email service configuration
├── middleware/
│   └── auth.js             # Authentication middleware
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── routes/
│   ├── admin.js            # Admin panel routes
│   └── contact.js          # Contact form routes
├── views/
│   ├── admin/              # Admin panel templates
│   ├── layout.ejs          # Main layout
│   ├── index.ejs           # Home page
│   ├── services.ejs        # Services page
│   ├── posts.ejs           # Blog page
│   ├── gallery.ejs         # Gallery page
│   ├── youtube.ejs         # Videos page
│   ├── contact.ejs         # Contact page
│   └── 404.ejs            # Error page
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md              # This file
```

## 🛠️ Technologies Used

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **EJS** - Template engine
- **MySQL** - Database
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing
- **Express-session** - Session management

### **Frontend**
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **JavaScript** - Interactive features

## 📊 Database Schema

### **Tables**
- `users` - Admin users
- `posts` - Blog posts
- `gallery` - Image gallery
- `youtube_videos` - Video content
- `services` - Service offerings
- `contact_messages` - Customer inquiries

## 🔧 Configuration

### **Email Setup**
The website uses SMTP for email functionality:
- Customer auto-replies
- Admin notifications
- Direct email replies from admin panel

### **File Uploads**
- Images are stored in `public/uploads/`
- Supported formats: JPEG, JPG, PNG, GIF
- Maximum file size: 5MB

### **Security**
- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation and sanitization

## 🚀 Deployment

### **Recommended Hosting**
1. **Railway** - Easy deployment with automatic SSL
2. **Render** - Free tier available with good performance
3. **Heroku** - Reliable with good documentation
4. **DigitalOcean** - High performance with easy scaling

### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
ADMIN_EMAIL=your_admin_email
```

## 📱 Features Overview

### **Public Pages**
- **Home** - Hero section, services overview, recent posts, gallery
- **Services** - Dynamic service listings with pricing
- **Blog** - Blog posts with search and pagination
- **Gallery** - Image gallery with lightbox
- **Videos** - YouTube video integration
- **Contact** - Contact form with email integration

### **Admin Panel**
- **Dashboard** - Overview with statistics
- **Posts** - Blog post management
- **Gallery** - Image upload and management
- **Videos** - YouTube video management
- **Services** - Service offerings management
- **Messages** - Customer inquiry management
- **Users** - User management (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💼 Contact

**Mobile Doctor**
- **Owner:** Sunny 
- **Phone:** +91968
- **Address:** 81, Ganesh Market,
- **Email:** dhr4@gmail.com

## 🙏 Acknowledgments

- **Design Inspiration:** Modern cyberpunk theme
- **Icons:** Font Awesome
- **Fonts:** Google Fonts (Poppins)
- **CSS Framework:** Tailwind CSS

---

**Built with ❤️ for Mobile Doctor** 