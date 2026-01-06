/**
 * Re-export session utilities for consistent imports
 */
export { getSession as getCurrentUser, requireAuth, requireAdmin } from './auth/session'
