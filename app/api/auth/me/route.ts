import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verify-auth'

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Transform to snake_case for mobile app compatibility
    const transformedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.fullName,
      phone: user.phone,
      avatar_url: user.avatarUrl,
      email_verified: user.emailVerified,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }

    return NextResponse.json({ user: transformedUser })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    )
  }
}
