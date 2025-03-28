// lib/enhanced-email.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Define available email providers
type EmailProvider = 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark';

/**
 * Send an email with fallback providers in case the primary provider fails
 */
export async function sendEmailWithFallback(options: EmailOptions): Promise<void> {
  // Define the order of providers to try
  const providers: EmailProvider[] = ['smtp', 'sendgrid'];
  
  let lastError: Error | null = null;
  
  // Try each provider in order until one succeeds
  for (const provider of providers) {
    try {
      console.log(`Attempting to send email using ${provider} provider...`);
      
      switch (provider) {
        case 'smtp':
          await sendEmailSMTP(options);
          console.log(`Email sent successfully via ${provider}`);
          return; // Exit if successful
          
        case 'sendgrid':
          await sendEmailSendGrid(options);
          console.log(`Email sent successfully via ${provider}`);
          return; // Exit if successful
          
        // Add other providers as needed
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Failed to send email using ${provider}:`, lastError.message);
      // Continue to next provider
    }
  }
  
  // If we've tried all providers and none worked, throw the last error
  if (lastError) {
    throw new Error(`All email providers failed: ${lastError.message}`);
  }
}

/**
 * Send email using SMTP
 */
async function sendEmailSMTP(options: EmailOptions): Promise<void> {
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
    throw new Error('SMTP email configuration is missing. Please set EMAIL_SERVER and EMAIL_FROM environment variables.');
  }

  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

/**
 * Send email using SendGrid
 */
async function sendEmailSendGrid(options: EmailOptions): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('SendGrid configuration is missing. Please set SENDGRID_API_KEY and EMAIL_FROM environment variables.');
  }
  
  try {
    // Dynamically import @sendgrid/mail
    const { default: sendgrid } = await import('@sendgrid/mail');
    
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sendgrid.send({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cannot find module '@sendgrid/mail'")) {
      throw new Error("SendGrid package not installed. Run 'npm install @sendgrid/mail' to use this provider.");
    }
    throw error;
  }
}

// For backward compatibility, use the new function with fallbacks
export async function sendEmail(options: EmailOptions): Promise<void> {
  return sendEmailWithFallback(options);
}