// lib/email.ts
import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@scanpro.cc';

// Email options interface
interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

/**
 * Send an email
 * @param options Email options (to, subject, text, html)
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
    // Check if email is configured
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
        console.warn('Email is not configured. Would have sent:');
        console.log({
            to: options.to,
            subject: options.subject,
            text: options.text
        });

        // In development, just log instead of sending
        if (process.env.NODE_ENV === 'development') {
            return;
        }

        // In production, try to use a fallback service or throw an error
        throw new Error('Email service is not configured');
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_PORT === 465, // true for 465, false for other ports
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    // Send email
    await transporter.sendMail({
        from: EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    });
}