import { redirect } from 'next/navigation'
import { getAuthToken, verifyToken } from './jwt'
import { db } from '@/lib/db'

/**
 * Get the current authenticated user from the session
 * @returns User object or null if not authenticated
 */
export async function getSession() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return null
    }

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

    return user
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

/**
 * Require authentication - throws redirect if not authenticated
 * @param redirectTo - Where to redirect if not authenticated (default: /login)
 * @returns User object
 */
export async function requireAuth(redirectTo: string = '/login') {
  const user = await getSession()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Require admin role - throws redirect if not admin
 * @returns Admin user object
 */
export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    redirect('/account')
  }

  return user
}
