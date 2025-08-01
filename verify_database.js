const mysql = require('mysql2');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'devil',
    port: 3306,
    database: 'mobiledoctor_db'
};

async function verifyDatabase() {
    const connection = mysql.createConnection(dbConfig);
    
    try {
        console.log('🔍 Verifying Mobile Doctor Database...\n');

        // Test connection
        await connection.promise().query('SELECT 1');
        console.log('✅ Database connection successful');

        // Check tables
        const [tables] = await connection.promise().query('SHOW TABLES');
        console.log('\n📋 Database Tables:');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
        });

        // Check data counts
        console.log('\n📊 Data Summary:');
        
        const [users] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
        console.log(`   👥 Users: ${users[0].count}`);

        const [posts] = await connection.promise().query('SELECT COUNT(*) as count FROM posts');
        console.log(`   📝 Posts: ${posts[0].count}`);

        const [gallery] = await connection.promise().query('SELECT COUNT(*) as count FROM gallery');
        console.log(`   🖼️ Gallery Items: ${gallery[0].count}`);

        const [videos] = await connection.promise().query('SELECT COUNT(*) as count FROM youtube_videos');
        console.log(`   📺 YouTube Videos: ${videos[0].count}`);

        const [services] = await connection.promise().query('SELECT COUNT(*) as count FROM services');
        console.log(`   🔧 Services: ${services[0].count}`);

        const [messages] = await connection.promise().query('SELECT COUNT(*) as count FROM contact_messages');
        console.log(`   💬 Messages: ${messages[0].count}`);

        // Check admin user
        const [adminUser] = await connection.promise().query('SELECT username, email, role FROM users WHERE username = "admin"');
        if (adminUser.length > 0) {
            console.log('\n👤 Admin User:');
            console.log(`   Username: ${adminUser[0].username}`);
            console.log(`   Email: ${adminUser[0].email}`);
            console.log(`   Role: ${adminUser[0].role}`);
        }

        console.log('\n✅ Database verification completed successfully!');
        console.log('\n🚀 Ready to start the server: npm start');

    } catch (error) {
        console.error('❌ Database verification failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure MySQL server is running');
        console.log('2. Verify credentials: root/devil');
        console.log('3. Run setup_database.js first');
    } finally {
        connection.end();
    }
}

verifyDatabase(); 