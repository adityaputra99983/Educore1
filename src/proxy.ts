import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';

// Define protected routes
const protectedRoutes = [
  '/teacher-dashboard',
  '/admin-dashboard',
  '/api/teachers',
  '/api/students',
  '/api/reports'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/verify',
  '/api/init-users',
  '/api/health-check'
];

// Export the config first (required for proxy API)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // If no token in header, check cookies
    if (!token) {
      const tokenFromCookie = request.cookies.get('authToken')?.value;
      if (tokenFromCookie) {
        token = tokenFromCookie;
      }
    }
    
    // Verify token
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}