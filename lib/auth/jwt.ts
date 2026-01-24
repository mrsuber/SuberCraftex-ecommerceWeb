import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = 'auth-token'
const TOKEN_EXPIRATION = '7d' // 7 days

export interface JWTPayload {
  userId: string
  role: string
  email: string
}

/**
 * Generate a JWT token for a user
 * @param payload - User data to encode in the token
 * @returns JWT token string
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(SECRET)
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Set authentication cookie with JWT token
 * @param token - JWT token to store in cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
  })
}

/**
 * Clear the authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Get the auth token from cookies or Authorization header
 * Checks Authorization header first (for mobile app), then cookies (for web)
 * @returns JWT token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  // First, check Authorization header (for mobile app / API clients)
  try {
    const headerStore = await headers()
    const authHeader = headerStore.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7) // Remove 'Bearer ' prefix
    }
  } catch (error) {
    // Headers might not be available in some contexts
  }

  // Fallback to cookie (for web)
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(COOKIE_NAME)
    return cookie?.value || null
  } catch (error) {
    return null
  }
}
