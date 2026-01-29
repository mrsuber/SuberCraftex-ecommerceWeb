import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPasswordResetRequest } from '@/lib/auth/password-reset'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Create password reset request (this will send the email)
    const success = await createPasswordResetRequest(email)

    if (!success) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        message: 'If an account with that email exists, we sent password reset instructions.',
      })
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we sent password reset instructions.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
