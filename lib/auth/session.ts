import { redirect } from 'next/navigation'
import { getAuthToken, verifyToken } from './jwt'
import { db } from '@/lib/db'

export const SESSION_USER_SELECT = {
  id: true,
  email: true,
  role: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  emailVerified: true,
  isSuperAdmin: true,
  createdAt: true,
  updatedAt: true,
} as const

/** The signed-in user for a token's user id, or null when the account is suspended. */
export async function findSessionUser(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { ...SESSION_USER_SELECT, isSuspended: true },
  })
  if (!user || user.isSuspended) return null
  const { isSuspended: _suspended, ...rest } = user
  return rest
}

/** Super admins manage payment keys and money settings. */
export function isSuperAdmin(user: { role: string; isSuperAdmin?: boolean } | null | undefined) {
  return !!user && user.role === 'admin' && user.isSuperAdmin === true
}

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

    const user = await findSessionUser(payload.userId)

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

/**
 * Require admin or tailor role - throws redirect if neither
 * @returns Admin or Tailor user object
 */
export async function requireAdminOrTailor() {
  const user = await requireAuth()

  if (user.role !== 'admin' && user.role !== 'tailor') {
    redirect('/account')
  }

  return user
}
