-- Mobile Doctor Database Setup Script
-- Run this script in your MySQL client

-- Create database
CREATE DATABASE IF NOT EXISTS mobiledoctor_db;
USE mobiledoctor_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255),
    author VARCHAR(100) NOT NULL,
    status ENUM('published', 'draft') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video_id VARCHAR(50) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    price DECIMAL(10,2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    device_type VARCHAR(50),
    service_needed VARCHAR(100),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (username, password, email, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@mobiledoctor.com', 'admin');

-- Insert sample posts
INSERT IGNORE INTO posts (title, content, author, status) VALUES
('Latest iPhone Repair Techniques', 'We''ve mastered the latest iPhone repair techniques including screen replacement, battery replacement, and water damage repair.', 'Mobile Doctor Team', 'published'),
('Android Flashing Guide', 'Complete guide to safely flash Android devices with custom ROMs and recovery tools.', 'Tech Expert', 'published'),
('5G Network Optimization', 'Tips and tricks to optimize your device for 5G networks and improve connectivity.', 'Network Specialist', 'published');

-- Insert sample gallery items
INSERT IGNORE INTO gallery (title, image, category, description) VALUES
('iPhone Screen Repair', '/images/gallery1.jpg', 'repair', 'Professional iPhone screen replacement service'),
('Android Flashing', '/images/gallery2.jpg', 'flashing', 'Android device flashing and custom ROM installation'),
('Battery Replacement', '/images/gallery3.jpg', 'repair', 'Mobile battery replacement service'),
('Water Damage Repair', '/images/gallery4.jpg', 'repair', 'Water damage repair and recovery'),
('Custom ROM Installation', '/images/gallery5.jpg', 'flashing', 'Custom ROM installation service'),
('Hardware Upgrades', '/images/gallery6.jpg', 'upgrade', 'Mobile hardware upgrade services');

-- Insert sample YouTube videos
INSERT IGNORE INTO youtube_videos (title, video_id, description, category) VALUES
('iPhone Screen Replacement Tutorial - Mobile Doctor', 'REPLACE_WITH_YOUR_IPHONE_SCREEN_VIDEO_ID', 'Professional iPhone screen replacement tutorial by Sunny Gujjar - Step by step guide', 'repair'),
('Android Flashing Complete Guide - Mobile Doctor', 'REPLACE_WITH_YOUR_ANDROID_FLASHING_VIDEO_ID', 'Complete Android flashing and custom ROM installation guide by Mobile Doctor', 'flashing'),
('Mobile Repair Tips & Tricks - Mobile Doctor', 'REPLACE_WITH_YOUR_REPAIR_TIPS_VIDEO_ID', 'Expert mobile repair tips and tricks from Sunny Gujjar', 'tips');

-- Insert sample services
INSERT IGNORE INTO services (name, description, icon, price, status) VALUES
('Screen Replacement', 'Professional screen replacement for all mobile devices', 'fas fa-mobile-alt', 1500.00, 'active'),
('Battery Replacement', 'Genuine battery replacement with warranty', 'fas fa-battery-full', 800.00, 'active'),
('Water Damage Repair', 'Expert water damage repair and recovery', 'fas fa-tint', 1200.00, 'active'),
('Software Flashing', 'Android and iOS software flashing services', 'fas fa-download', 500.00, 'active'),
('Unlocking Service', 'Network unlocking for all mobile devices', 'fas fa-unlock', 300.00, 'active'),
('Hardware Repair', 'Complete hardware repair and replacement', 'fas fa-tools', 2000.00, 'active');

-- Show tables
SHOW TABLES;

-- Show sample data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Gallery', COUNT(*) FROM gallery
UNION ALL
SELECT 'YouTube Videos', COUNT(*) FROM youtube_videos
UNION ALL
SELECT 'Services', COUNT(*) FROM services
UNION ALL
SELECT 'Contact Messages', COUNT(*) FROM contact_messages; 