// lib/email.ts
import nodemailer from 'nodemailer';
import { passwordResetTemplate, passwordResetSuccessTemplate, welcomeTemplate } from './email-templates';
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create a transporter with configuration
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};
// Send email function
export const sendEmail = async ({ to, subject, html, text }: EmailOptions): Promise<{ success: boolean; messageUrl?: string; error?: string }> => {
  try {


    const transporter = createTransporter();

    // Set from address
    const from = process.env.EMAIL_FROM || 'noreply@scanpro.cc';

    // Send mail
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''), // Strip HTML as fallback
      html,
    });

    console.log(`✅ Email sent to ${to}`);

    // If using Ethereal, provide preview URL
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      return {
        success: true,
        // messageUrl: nodemailer.getTestMessageUrl(info) 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending email'
    };
  }
};
export const sendVerificationEmail = async (email: string, token: string, name?: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/en/verify-email?token=${token}`;

  const htmlContent = welcomeTemplate({
    name: name || 'there',
    verificationUrl
  });

  return await sendEmail({
    to: email,
    subject: 'Verify Your Email Address for ScanPro',
    html: htmlContent
  });
};
// Function to send a password reset email
export const sendPasswordResetEmail = async (email: string, token: string, username?: string): Promise<{ success: boolean; messageUrl?: string; error?: string }> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/en/reset-password/${token}`;

  // Use the template from email-templates.ts
  const html = passwordResetTemplate({
    resetUrl,
    username
  });

  return sendEmail({
    to: email,
    subject: 'Reset Your ScanPro Password',
    html
  });
};

// Function to send a password reset success email
export const sendPasswordResetSuccessEmail = async (email: string, username?: string): Promise<{ success: boolean; messageUrl?: string; error?: string }> => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = `${baseUrl}/en/login`;

  // Use the template from email-templates.ts
  const html = passwordResetSuccessTemplate({
    loginUrl,
    username
  });

  return sendEmail({
    to: email,
    subject: 'Your ScanPro Password Has Been Reset',
    html
  });
};