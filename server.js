/**
 * Express Server for Registration Form
 * Handles form submissions, email, and SMS notifications
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email transporter configuration
let emailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Twilio client configuration
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
}

/**
 * Validation rules for registration form
 */
const registrationValidation = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+?[\d\s\-\(\)]{10,}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('whatsapp')
        .trim()
        .notEmpty()
        .withMessage('WhatsApp number is required')
        .matches(/^\+?[\d\s\-\(\)]{10,}$/)
        .withMessage('Please provide a valid WhatsApp number'),
    
    body('hearAbout')
        .notEmpty()
        .withMessage('Please select how you heard about the event'),
    
];

/**
 * Send confirmation email
 */
async function sendConfirmationEmail(userData) {
    if (!emailTransporter) {
        console.warn('Email transporter not configured. Skipping email send.');
        return false;
    }
    
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Reset Global People'}" <${process.env.SMTP_USER}>`,
            to: userData.email,
            subject: 'Registration Confirmation - What I Wish I Knew Before I Left University',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #2c2c2c; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #FFD700; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f5f3ed; padding: 30px; border-radius: 0 0 8px 8px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #8b7a6b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2 style="margin: 0; color: #2c2c2c;">Registration Confirmed</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${userData.fullName},</p>
                        <p>Thank you for registering for <strong>"What I Wish I Knew Before I Left University"</strong>! We've received your information and your place has been secured.</p>
                        <p><strong>Event Details:</strong></p>
                        <ul>
                            <li><strong>Date:</strong> Friday 14th March 2025</li>
                            <li><strong>Time:</strong> 9:00 AM</li>
                            <li><strong>Venue:</strong> GCTU Main Campus</li>
                        </ul>
                        <p><strong>Your Registration Details:</strong></p>
                        <ul>
                            <li><strong>Name:</strong> ${userData.fullName}</li>
                            <li><strong>Email:</strong> ${userData.email}</li>
                            <li><strong>Phone:</strong> ${userData.phone}</li>
                            <li><strong>WhatsApp:</strong> ${userData.whatsapp}</li>
                        </ul>
                        <p>We'll be in touch soon with important updates and next steps. Please keep this email for your records.</p>
                        <p>For any enquiries, contact us at: <a href="tel:+233592924722">+233 (0) 59 292 4722</a></p>
                        <p>Best regards,<br><strong>Reset Global People</strong></p>
                    </div>
                    <div class="footer">
                        <p>Copyright © 2025 ResetGlobalPeople. All Rights Reserved</p>
                    </div>
                </div>
            </body>
            </html>
        `,
            text: `
            Registration Confirmation - What I Wish I Knew Before I Left University
            
            Dear ${userData.fullName},
            
            Thank you for registering! We've received your information and your place has been secured.
            
            Event Details:
            - Date: Friday 14th March 2025
            - Time: 9:00 AM
            - Venue: GCTU Main Campus
            
            Your Registration Details:
            - Name: ${userData.fullName}
            - Email: ${userData.email}
            - Phone: ${userData.phone}
            - WhatsApp: ${userData.whatsapp}
            
            We'll be in touch soon with important updates and next steps.
            
            For any enquiries, contact us at: +233 (0) 59 292 4722
            
            Best regards,
            Reset Global People
        `
        };
    
    try {
        await emailTransporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', userData.email);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

/**
 * Send confirmation SMS
 */
async function sendConfirmationSMS(userData) {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn('Twilio not configured. Skipping SMS send.');
        return false;
    }
    
    const message = `Hello ${userData.fullName}! Your registration for "What I Wish I Knew Before I Left University" is confirmed. Event: Friday 14th March 2025, 9:00 AM at GCTU Main Campus. We've sent details to ${userData.email}. - Reset Global People`;
    
    try {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: userData.phone.replace(/\s/g, '') // Remove spaces from phone number
        });
        console.log('Confirmation SMS sent to:', userData.phone);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

/**
 * Registration endpoint
 */
app.post('/api/register', registrationValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        const userData = req.body;
        
        // Log registration (in production, save to database)
        console.log('New registration:', {
            name: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            timestamp: new Date().toISOString()
        });
        
        // Send notifications (non-blocking)
        const emailSent = await sendConfirmationEmail(userData);
        const smsSent = await sendConfirmationSMS(userData);
        
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Registration successful',
            notifications: {
                email: emailSent,
                sms: smsSent
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your registration. Please try again later.'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            email: emailTransporter ? 'configured' : 'not configured',
            sms: twilioClient ? 'configured' : 'not configured'
        }
    });
});

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment check:');
    console.log(`- Email: ${emailTransporter ? '✓ Configured' : '✗ Not configured'}`);
    console.log(`- SMS: ${twilioClient ? '✓ Configured' : '✗ Not configured'}`);
});

