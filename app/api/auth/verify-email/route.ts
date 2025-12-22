import { NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/auth/verification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Verify the token and update user
    const user = await verifyEmailToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Email verified successfully! You can now log in.',
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}
