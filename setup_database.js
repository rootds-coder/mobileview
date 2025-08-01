const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'mysql9.serv00.com',
    user: process.env.DB_USER || 'm5739_mobile',
    password: process.env.DB_PASSWORD || 'B2ahikct6i',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'm5739_mobiledoctor_db'
};

// Create connection with database
const connection = mysql.createConnection(dbConfig);

async function setupDatabase() {
    try {
        console.log('🔧 Setting up Mobile Doctor Database...\n');

        // Test connection to existing database
        await connection.promise().query('SELECT 1');
        console.log('✅ Successfully connected to remote database "m5739_mobiledoctor_db"');

        // Create tables
        console.log('\n📋 Creating tables...');

        // Users table
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                role ENUM('admin', 'editor') DEFAULT 'editor',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created');

        // Posts table
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(255),
                image_url VARCHAR(500),
                author VARCHAR(100) NOT NULL,
                status ENUM('published', 'draft') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Posts table created');

        // Gallery table
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                category VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Gallery table created');

        // YouTube videos table
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS youtube_videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                video_id VARCHAR(50) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ YouTube videos table created');

        // Services table
        await connection.promise().query(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon VARCHAR(100),
                price DECIMAL(10,2),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Services table created');

        // Contact messages table
        await connection.promise().query(`
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
            )
        `);
        console.log('✅ Contact messages table created');

        // Insert default admin user
        console.log('\n👤 Creating default admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.promise().query(`
            INSERT IGNORE INTO users (username, password, email, role) 
            VALUES ('admin', ?, 'admin@mobiledoctor.com', 'admin')
        `, [hashedPassword]);
        console.log('✅ Default admin user created (username: admin, password: admin123)');

        // Insert sample data
        console.log('\n📝 Inserting sample data...');

        // Sample posts
        await connection.promise().query(`
            INSERT IGNORE INTO posts (title, content, author, status) VALUES
            ('Latest iPhone Repair Techniques', 'We''ve mastered the latest iPhone repair techniques including screen replacement, battery replacement, and water damage repair.', 'Mobile Doctor Team', 'published'),
            ('Android Flashing Guide', 'Complete guide to safely flash Android devices with custom ROMs and recovery tools.', 'Tech Expert', 'published'),
            ('5G Network Optimization', 'Tips and tricks to optimize your device for 5G networks and improve connectivity.', 'Network Specialist', 'published')
        `);
        console.log('✅ Sample posts inserted');

        // Sample gallery items
        await connection.promise().query(`
            INSERT IGNORE INTO gallery (title, image, category, description) VALUES
            ('iPhone Screen Repair', '/images/gallery1.jpg', 'repair', 'Professional iPhone screen replacement service'),
            ('Android Flashing', '/images/gallery2.jpg', 'flashing', 'Android device flashing and custom ROM installation'),
            ('Battery Replacement', '/images/gallery3.jpg', 'repair', 'Mobile battery replacement service'),
            ('Water Damage Repair', '/images/gallery4.jpg', 'repair', 'Water damage repair and recovery'),
            ('Custom ROM Installation', '/images/gallery5.jpg', 'flashing', 'Custom ROM installation service'),
            ('Hardware Upgrades', '/images/gallery6.jpg', 'upgrade', 'Mobile hardware upgrade services')
        `);
        console.log('✅ Sample gallery items inserted');

        // Sample YouTube videos
        await connection.promise().query(`
            INSERT IGNORE INTO youtube_videos (title, video_id, description, category) VALUES
            ('iPhone Screen Replacement Tutorial - Mobile Doctor', 'REPLACE_WITH_YOUR_IPHONE_SCREEN_VIDEO_ID', 'Professional iPhone screen replacement tutorial by Sunny Gujjar - Step by step guide', 'repair'),
            ('Android Flashing Complete Guide - Mobile Doctor', 'REPLACE_WITH_YOUR_ANDROID_FLASHING_VIDEO_ID', 'Complete Android flashing and custom ROM installation guide by Mobile Doctor', 'flashing'),
            ('Mobile Repair Tips & Tricks - Mobile Doctor', 'REPLACE_WITH_YOUR_REPAIR_TIPS_VIDEO_ID', 'Expert mobile repair tips and tricks from Sunny Gujjar', 'tips')
        `);
        console.log('✅ Sample YouTube videos inserted');

        // Sample services
        await connection.promise().query(`
            INSERT IGNORE INTO services (name, description, icon, price, status) VALUES
            ('Screen Replacement', 'Professional screen replacement for all mobile devices', 'fas fa-mobile-alt', 1500.00, 'active'),
            ('Battery Replacement', 'Genuine battery replacement with warranty', 'fas fa-battery-full', 800.00, 'active'),
            ('Water Damage Repair', 'Expert water damage repair and recovery', 'fas fa-tint', 1200.00, 'active'),
            ('Software Flashing', 'Android and iOS software flashing services', 'fas fa-download', 500.00, 'active'),
            ('Unlocking Service', 'Network unlocking for all mobile devices', 'fas fa-unlock', 300.00, 'active'),
            ('Hardware Repair', 'Complete hardware repair and replacement', 'fas fa-tools', 2000.00, 'active')
        `);
        console.log('✅ Sample services inserted');

        // Show summary
        console.log('\n📊 Database Summary:');
        const [users] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
        const [posts] = await connection.promise().query('SELECT COUNT(*) as count FROM posts');
        const [gallery] = await connection.promise().query('SELECT COUNT(*) as count FROM gallery');
        const [videos] = await connection.promise().query('SELECT COUNT(*) as count FROM youtube_videos');
        const [services] = await connection.promise().query('SELECT COUNT(*) as count FROM services');
        const [messages] = await connection.promise().query('SELECT COUNT(*) as count FROM contact_messages');

        console.log(`👥 Users: ${users[0].count}`);
        console.log(`📝 Posts: ${posts[0].count}`);
        console.log(`🖼️ Gallery Items: ${gallery[0].count}`);
        console.log(`📺 YouTube Videos: ${videos[0].count}`);
        console.log(`🔧 Services: ${services[0].count}`);
        console.log(`💬 Messages: ${messages[0].count}`);

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n🔗 Next steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Visit admin panel: http://localhost:3000/sunny/login');
        console.log('3. Login with: admin / admin123');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure MySQL server is running');
        console.log('2. Verify credentials: root/devil');
        console.log('3. Check if MySQL is installed and accessible');
    } finally {
        connection.end();
    }
}

// Run the setup
setupDatabase(); 