import { getSession } from './session';

/**
 * Require authentication for API routes
 * Returns user object or null if not authenticated (doesn't redirect)
 */
export async function requireApiAuth() {
  const user = await getSession();

  if (!user) {
    return null;
  }

  return user;
}

/**
 * Require admin role for API routes
 * Returns admin user object or null if not authorized (doesn't redirect)
 */
export async function requireApiAdmin() {
  const user = await requireApiAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return user;
}
