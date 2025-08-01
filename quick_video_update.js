const mysql = require('mysql2');
const readline = require('readline');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'devil',
    port: 3306,
    database: 'mobiledoctor_db'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function updateVideoID() {
    const connection = mysql.createConnection(dbConfig);
    
    try {
        console.log('🎬 Quick YouTube Video ID Update\n');
        
        // Show current videos
        const [videos] = await connection.promise().query('SELECT * FROM youtube_videos ORDER BY id');
        console.log('📺 Current Videos:');
        videos.forEach((video, index) => {
            console.log(`${index + 1}. ${video.title}`);
            console.log(`   Current ID: ${video.video_id}`);
            console.log(`   URL: https://www.youtube.com/watch?v=${video.video_id}\n`);
        });

        // Ask which video to update
        rl.question('Enter the number of the video to update (1-6): ', async (answer) => {
            const videoIndex = parseInt(answer) - 1;
            
            if (videoIndex < 0 || videoIndex >= videos.length) {
                console.log('❌ Invalid video number');
                rl.close();
                connection.end();
                return;
            }

            const video = videos[videoIndex];
            
            // Ask for new video ID
            rl.question(`Enter new video ID for "${video.title}": `, async (newVideoId) => {
                if (!newVideoId.trim()) {
                    console.log('❌ Video ID cannot be empty');
                    rl.close();
                    connection.end();
                    return;
                }

                try {
                    // Update the video
                    await connection.promise().query(
                        'UPDATE youtube_videos SET video_id = ? WHERE id = ?',
                        [newVideoId.trim(), video.id]
                    );
                    
                    console.log(`✅ Updated "${video.title}"`);
                    console.log(`   New URL: https://www.youtube.com/watch?v=${newVideoId.trim()}`);
                    console.log('\n🎉 Video updated successfully!');
                    console.log('💡 Visit http://localhost:3000/youtube to see the changes');
                    
                } catch (error) {
                    console.error('❌ Error updating video:', error.message);
                } finally {
                    rl.close();
                    connection.end();
                }
            });
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        connection.end();
    }
}

updateVideoID(); 