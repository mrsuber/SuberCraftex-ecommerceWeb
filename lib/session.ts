/**
 * Re-export session utilities for consistent imports
 */
export { getSession as getCurrentUser, requireAuth, requireAdmin, requireAdminOrTailor } from './auth/session'
