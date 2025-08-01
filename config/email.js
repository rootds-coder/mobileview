const nodemailer = require('nodemailer');

// Email configuration - using only environment variables
const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

// Validate required environment variables
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Missing required SMTP environment variables:');
    console.error('SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ Missing');
    console.error('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing');
    console.error('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
    throw new Error('Missing required SMTP configuration in environment variables');
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
    // Auto-reply to customer
    customerAutoReply: (customerData) => ({
        subject: 'Thank you for contacting Mobile Doctor',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: #1a1a1a; color: #00ffff; padding: 20px; text-align: center; border-radius: 10px;">
                    <h1 style="margin: 0; color: #00ffff;">Mobile Doctor</h1>
                    <p style="margin: 10px 0; color: #ffffff;">Professional Mobile Repair Services</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 20px; margin-top: 20px; border-radius: 10px;">
                    <h2 style="color: #333;">Thank you for contacting us!</h2>
                    
                    <p>Dear ${customerData.firstName} ${customerData.lastName},</p>
                    
                    <p>We have received your inquiry and our team will get back to you within 24 hours.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #333;">Your Inquiry Details:</h3>
                        <p><strong>Service Required:</strong> ${customerData.service}</p>
                        <p><strong>Message:</strong> ${customerData.message}</p>
                        <p><strong>Contact:</strong> ${customerData.email} | ${customerData.phone}</p>
                    </div>
                    
                    <p>In the meantime, you can:</p>
                    <ul>
                        <li>Visit our website for more information</li>
                        <li>Check our service prices</li>
                        <li>Follow us on social media for updates</li>
                    </ul>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p><strong>Contact Information:</strong></p>
                        <p>📞 Phone: +91 99929 19688</p>
                        <p>📍 Address: 81, Ganesh Market, Bhamashah Nagar, Hisar, Haryana 125001</p>
                        <p>👨‍💼 Owner: Sunny Gujjar</p>
                        <p>🕒 Hours: Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666;">
                    <p>© 2024 Mobile Doctor. All rights reserved.</p>
                </div>
            </div>
        `
    }),

    // Forward to admin
    adminNotification: (customerData) => ({
        subject: 'New Customer Inquiry - Mobile Doctor',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: #1a1a1a; color: #00ffff; padding: 20px; text-align: center; border-radius: 10px;">
                    <h1 style="margin: 0; color: #00ffff;">New Customer Inquiry</h1>
                    <p style="margin: 10px 0; color: #ffffff;">Mobile Doctor Website</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 20px; margin-top: 20px; border-radius: 10px;">
                    <h2 style="color: #333;">Customer Details:</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${customerData.firstName} ${customerData.lastName}</p>
                        <p><strong>Email:</strong> ${customerData.email}</p>
                        <p><strong>Phone:</strong> ${customerData.phone}</p>
                        <p><strong>Service Required:</strong> ${customerData.service}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ddd; border-radius: 3px;">
                            ${customerData.message}
                        </div>
                    </div>
                    
                    <p><strong>Inquiry Date:</strong> ${new Date().toLocaleString()}</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p>Please respond to this customer inquiry as soon as possible.</p>
                        <p>You can contact them at: ${customerData.email} or ${customerData.phone}</p>
                    </div>
                </div>
            </div>
        `
    })
};

// Email functions
const emailService = {
    // Send auto-reply to customer
    sendCustomerAutoReply: async (customerData) => {
        try {
            const mailOptions = {
                from: `"Mobile Doctor" <${emailConfig.auth.user}>`,
                to: customerData.email,
                ...emailTemplates.customerAutoReply(customerData)
            };

            const result = await transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending customer auto-reply:', error);
            return { success: false, error: error.message };
        }
    },

    // Forward inquiry to admin
    sendAdminNotification: async (customerData) => {
        try {
            const mailOptions = {
                from: `"Mobile Doctor Website" <${emailConfig.auth.user}>`,
                to: process.env.ADMIN_EMAIL || 'dhruv9671267714@gmail.com',
                ...emailTemplates.adminNotification(customerData)
            };

            const result = await transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending admin notification:', error);
            return { success: false, error: error.message };
        }
    },

    // Send both emails
    sendContactEmails: async (customerData) => {
        try {
            // Send auto-reply to customer
            const customerResult = await emailService.sendCustomerAutoReply(customerData);
            
            // Send notification to admin
            const adminResult = await emailService.sendAdminNotification(customerData);
            
            return {
                customerEmail: customerResult,
                adminEmail: adminResult,
                success: customerResult.success && adminResult.success
            };
        } catch (error) {
            console.error('Error sending contact emails:', error);
            return { success: false, error: error.message };
        }
    },

    // Test email configuration
    testEmailConfig: async () => {
        try {
            await transporter.verify();
            return { success: true, message: 'Email configuration is valid' };
        } catch (error) {
            console.error('Email configuration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Send direct email (for admin replies)
    sendDirectEmail: async (emailData) => {
        try {
            const mailOptions = {
                from: `"Mobile Doctor" <${emailConfig.auth.user}>`,
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html || emailData.text.replace(/\n/g, '<br>')
            };

            const result = await transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending direct email:', error);
            return { success: false, error: error.message };
        }
    }
};

module.exports = emailService; 