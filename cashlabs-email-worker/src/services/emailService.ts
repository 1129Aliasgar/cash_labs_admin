/**
 * emailService.ts — SendGrid email delivery for the email worker.
 * Implements sendVerificationEmail().
 */

import sgMail from '@sendgrid/mail';
import { config } from '../config';

// Initialize SDK with API key from config
sgMail.setApiKey(config.sendgrid.apiKey);

/**
 * Send a verification email to the newly registered user.
 * The verification link points to the Frontend's verify page.
 */
export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const verificationLink = `${config.app.frontendUrl}/auth/verify-email?token=${token}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 32px 40px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
          CashLabs Admin
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">Secure Payment Gateway Network</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 16px;">
          Verify your email address
        </h2>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          Welcome to CashLabs. You're one step away from accessing the admin gateway.
          Click the button below to verify your email address and activate your account.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}"
             style="display: inline-block; background: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">
            Verify Email Address
          </a>
        </div>

        <!-- Link fallback -->
        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verificationLink}" style="color: #2563eb; word-break: break-all;">${verificationLink}</a>
        </p>

        <!-- Expiry notice -->
        <div style="margin: 28px 0 0; padding: 16px; background: #fef9c3; border: 1px solid #fde047; border-radius: 8px;">
          <p style="color: #713f12; font-size: 13px; margin: 0; font-weight: 500;">
            ⚠️ This link expires in <strong>24 hours</strong>. If you did not create this account, please ignore this email.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 20px 0;">
        CashLabs Admin · Secure Payment Gateway Network · This is an automated message
      </p>
    </div>
  `;

  await sgMail.send({
    to,
    from: config.sendgrid.from,
    subject: 'Verify your CashLabs Admin account',
    html,
  });

  console.log(`[EmailService] Verification email sent to ${to}`);
}
