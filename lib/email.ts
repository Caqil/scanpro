// lib/email.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    // Create a transport
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: process.env.EMAIL_SERVER_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    });

    // Send the email
    try {
        await transport.sendMail({
            from: process.env.EMAIL_FROM || 'support@scanpro.cc',
            to,
            subject,
            text,
            html: html || text,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
}

// For development/testing, you can use this function to log emails to console
export async function sendTestEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    console.log('==================');
    console.log('Test Email Output:');
    console.log('------------------');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Text:');
    console.log(text);
    if (html) {
        console.log('HTML:');
        console.log(html);
    }
    console.log('==================');
}

// Choose the appropriate email function based on environment
export const sendEmailWithEnv = process.env.NODE_ENV === 'production' ? sendEmail : sendTestEmail;