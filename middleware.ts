import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "auth-token";

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ["/account", "/checkout", "/dashboard"];
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Auth routes (login, register)
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  // Redirect to login if accessing protected route without auth
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Don't redirect logged-in users from auth pages - let them access if needed
  // This prevents redirect loops when there's a session mismatch

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
