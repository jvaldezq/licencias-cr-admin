import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@auth0/nextjs-auth0/edge";

const allowedOrigins = [
  'http://localhost:3000',
  'https://licenciacostarica.com',
  'https://www.licenciacostarica.com'
];

// Public routes that don't require authentication
const publicRoutes = [
  '/api/assessments'
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

function applyCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle preflight OPTIONS requests (these don't need auth)
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Handle public routes without auth
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    return applyCorsHeaders(response, request);
  }

  // For protected routes, check Auth0 session
  const session = await getSession(request, NextResponse.next());

  if (!session) {
    // Redirect to Auth0 login
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }

  // Continue with Auth0 protection for all other routes
  const response = NextResponse.next();

  // Apply CORS headers to API routes after auth
  if (pathname.startsWith('/api/')) {
    return applyCorsHeaders(response, request);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/events", "/locations", "/assets", "/licenses", "/people"],
};