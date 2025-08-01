const express = require('express');
const router = express.Router();
const emailService = require('../config/email');

// Contact form submission
router.post('/submit', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            service,
            message
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Prepare customer data
        const customerData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            service: service || 'General Inquiry',
            message: message.trim()
        };

        // Send emails
        const emailResult = await emailService.sendContactEmails(customerData);

        if (emailResult.success) {
            res.json({
                success: true,
                message: 'Thank you for your message! We will get back to you soon.',
                data: {
                    customerEmail: emailResult.customerEmail.success,
                    adminEmail: emailResult.adminEmail.success
                }
            });
        } else {
            console.error('Email sending failed:', emailResult.error);
            res.status(500).json({
                success: false,
                message: 'Message received but there was an issue sending confirmation emails. We will contact you soon.'
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request. Please try again.'
        });
    }
});

// Test email configuration
router.get('/test-email', async (req, res) => {
    try {
        const result = await emailService.testEmailConfig();
        res.json(result);
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 