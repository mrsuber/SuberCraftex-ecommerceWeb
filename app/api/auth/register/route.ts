import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import {
  generateVerificationToken,
  sendVerificationEmail,
} from '@/lib/auth/verification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        emailVerified: false,
      },
    })

    // Generate verification token
    const token = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    // Create verification record
    await db.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send verification email
    try {
      await sendVerificationEmail(user.email, token)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't block registration if email fails
    }

    return NextResponse.json(
      {
        message:
          'Registration successful! Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
