import { NextRequest } from 'next/server'
import { getSession } from './session'
import { verifyToken } from './jwt'
import { db } from '@/lib/db'

/**
 * Verify authentication from request
 * Supports both:
 * - Bearer token in Authorization header (for mobile apps)
 * - Cookie-based auth (for web)
 * Returns user object and auth status
 */
export async function verifyAuth(request: NextRequest) {
  try {
    // First, check for Bearer token in Authorization header (mobile app)
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const payload = await verifyToken(token)

      if (payload) {
        // Fetch user from database
        const user = await db.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            role: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        if (user) {
          return {
            user,
            isAuthenticated: true,
          }
        }
      }
    }

    // Fall back to cookie-based session (web)
    const user = await getSession()

    return {
      user,
      isAuthenticated: !!user,
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      user: null,
      isAuthenticated: false,
    }
  }
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(request: NextRequest) {
  const { user } = await verifyAuth(request)

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { user }
}

/**
 * Require admin role (throws if not admin)
 */
export async function requireAdmin(request: NextRequest) {
  const { user } = await requireAuth(request)

  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required')
  }

  return { user }
}
