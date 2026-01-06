import { NextRequest } from 'next/server'
import { getSession } from './session'

/**
 * Verify authentication from request
 * Returns user object and auth status
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function verifyAuth(_request: NextRequest) {
  try {
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
