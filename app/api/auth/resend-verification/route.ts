import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  generateVerificationToken,
  sendVerificationEmail,
} from '@/lib/auth/verification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If the email exists, a verification link has been sent.',
      })
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Delete any existing verification tokens for this user
    await db.emailVerification.deleteMany({
      where: { userId: user.id },
    })

    // Generate new verification token
    const token = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    // Create new verification record
    await db.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail(user.email, token)

    return NextResponse.json({
      message: 'Verification email sent! Please check your inbox.',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending verification email' },
      { status: 500 }
    )
  }
}
