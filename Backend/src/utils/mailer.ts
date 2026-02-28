import sgMail from '@sendgrid/mail';
import { config } from '../config';

/**
 * Reusable mailing utility for PSPManager.
 * Uses SendGrid API for delivery.
 */

sgMail.setApiKey(config.email.apiKey);

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a generic email via SendGrid.
 */
export async function sendMail(options: MailOptions): Promise<void> {
  try {
    await sgMail.send({
      to: options.to,
      from: config.email.from,
      subject: options.subject,
      html: options.html,
    });
  } catch (error: any) {
    console.error('[Mailer] Error sending email via SendGrid:', error?.response?.body || error);
    throw new Error('Could not send verification email. Please try again later.');
  }
}

/**
 * Send a dedicated verification email with branded HTML.
 */
export async function sendVerificationEmail(
  to: string,
  fullName: string,
  verificationLink: string
): Promise<void> {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h2 style="color: #2563eb; margin-bottom: 24px;">PSPManager</h2>
      <p style="font-size: 16px; color: #374151;">Hi ${fullName},</p>
      <p style="font-size: 16px; color: #374151;">
        Welcome to CashLabs Admin. Please click the button below to verify your email address 
        and activate your account.
      </p>
      <div style="margin: 32px 0;">
        <a href="${verificationLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
        This link will expire in <strong>24 hours</strong>. If you did not create an account, please ignore this email.
      </p>
      <p style="font-size: 12px; color: #9ca3af;">
        PSPManager Security System — Verified Activation
      </p>
    </div>
  `;

  await sendMail({
    to,
    subject: 'Activate Your PSPManager Account',
    html,
  });
}
