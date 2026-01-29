import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resetPassword, verifyPasswordResetToken } from '@/lib/auth/password-reset'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// GET - Verify token validity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false })
    }

    const isValid = await verifyPasswordResetToken(token)
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ valid: false })
  }
}

// POST - Reset password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    const result = await resetPassword(token, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
