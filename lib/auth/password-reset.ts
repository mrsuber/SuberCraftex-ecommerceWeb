import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { hashPassword } from './password'

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
 * Generate a random password reset token
 * @returns Random token string
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a password reset record and send email
 * @param email - User's email address
 * @returns true if email sent successfully, false otherwise
 */
export async function createPasswordResetRequest(email: string): Promise<boolean> {
  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return true
    }

    // Delete any existing password reset tokens for this user
    await db.passwordReset.deleteMany({
      where: { userId: user.id },
    })

    // Generate new token
    const token = generatePasswordResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Create password reset record
    await db.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send password reset email
    await sendPasswordResetEmail(email, token, user.fullName || 'User')

    return true
  } catch (error) {
    console.error('Failed to create password reset request:', error)
    return false
  }
}

/**
 * Send password reset email to user
 * @param email - User's email address
 * @param token - Password reset token
 * @param name - User's name for personalization
 */
async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Reset your SuberCraftex password',
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
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>

            <p>Hi ${name},</p>

            <p>We received a request to reset your password for your SuberCraftex account. Click the button below to set a new password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #E11D48; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>

            <p>Or copy and paste this link into your browser:</p>
            <p style="background: white; padding: 12px; border-radius: 5px; word-break: break-all; font-size: 14px; color: #666;">
              ${resetUrl}
            </p>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} SuberCraftex. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Verify password reset token and reset password
 * @param token - Password reset token
 * @param newPassword - New password to set
 * @returns Object with success status and message
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Find the password reset record
    const resetRecord = await db.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetRecord) {
      return { success: false, message: 'Invalid or expired reset link' }
    }

    // Check if token is already used
    if (resetRecord.usedAt) {
      return { success: false, message: 'This reset link has already been used' }
    }

    // Check if token is expired
    const now = new Date()
    if (now > resetRecord.expiresAt) {
      // Delete expired token
      await db.passwordReset.delete({
        where: { id: resetRecord.id },
      })
      return { success: false, message: 'Reset link has expired. Please request a new one.' }
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword)

    // Update user password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      db.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ])

    return { success: true, message: 'Password reset successfully' }
  } catch (error) {
    console.error('Password reset failed:', error)
    return { success: false, message: 'An error occurred while resetting your password' }
  }
}

/**
 * Verify if a password reset token is valid
 * @param token - Password reset token
 * @returns true if valid, false otherwise
 */
export async function verifyPasswordResetToken(token: string): Promise<boolean> {
  try {
    const resetRecord = await db.passwordReset.findUnique({
      where: { token },
    })

    if (!resetRecord) {
      return false
    }

    // Check if token is already used
    if (resetRecord.usedAt) {
      return false
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      return false
    }

    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}
