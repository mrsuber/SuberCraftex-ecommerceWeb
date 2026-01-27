import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Generate a random verification token
 * @returns Random token string
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Send verification email to user
 * @param email - User's email address
 * @param token - Verification token
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`

  try {
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your SuberCraftex account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E11D48 0%, #8B1538 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SuberCraftex</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>

              <p>Thank you for signing up for SuberCraftex! To complete your registration, please verify your email address by clicking the button below:</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: #E11D48; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="background: white; padding: 12px; border-radius: 5px; word-break: break-all; font-size: 14px; color: #666;">
                ${verificationUrl}
              </p>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Verify an email token and mark user as verified
 * @param token - Verification token
 * @returns User object if successful, null if failed
 */
export async function verifyEmailToken(token: string) {
  try {
    // Find the verification record
    const verification = await db.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verification) {
      return null
    }

    // Check if token is expired (24 hours)
    const now = new Date()
    if (now > verification.expiresAt) {
      // Delete expired token
      await db.emailVerification.delete({
        where: { id: verification.id },
      })
      return null
    }

    // Update user as verified
    const user = await db.user.update({
      where: { id: verification.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    })

    // Delete the verification token (single use)
    await db.emailVerification.delete({
      where: { id: verification.id },
    })

    return user
  } catch (error) {
    console.error('Email verification failed:', error)
    return null
  }
}
