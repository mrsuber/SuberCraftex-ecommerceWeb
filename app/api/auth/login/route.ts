import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { generateToken, setAuthCookie } from '@/lib/auth/jwt'
import { clientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Slow down password guessing: per address and per account
    const ip = clientIp(request)
    if (!rateLimit(`login:ip:${ip}`, 30, 15 * 60 * 1000) ||
        (typeof email === 'string' && !rateLimit(`login:email:${email.toLowerCase()}`, 10, 15 * 60 * 1000))) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
        { status: 429 }
      )
    }

    // Validate input
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'This account has been suspended. Please contact SuberCraftex.', suspended: true },
        { status: 403 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in',
          emailNotVerified: true,
        },
        { status: 403 }
      )
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set auth cookie
    await setAuthCookie(token)

    // Return user data (without password) - snake_case for mobile compatibility
    return NextResponse.json({
      message: 'Login successful',
      token, // Include token for mobile apps
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.fullName,
        phone: user.phone,
        avatar_url: user.avatarUrl,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
