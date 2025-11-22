import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@auth0/nextjs-auth0/edge";

// Determine allowed origins based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

const allowedOrigins = isDevelopment
  ? [
      'http://localhost:3000',
      'https://www.licenciacostarica.com'
    ]
  : [
      'https://www.licenciacostarica.com'
    ];

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

  // Handle all API routes publicly (no auth required)
  if (pathname.startsWith('/api/')) {
    // Handle preflight OPTIONS requests
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

    // Apply CORS headers to all API requests and allow them through
    const response = NextResponse.next();
    return applyCorsHeaders(response, request);
  }

  // For all non-API routes, require authentication
  const session = await getSession(request, NextResponse.next());

  if (!session) {
    // User is not authenticated, redirect to login
    const loginUrl = new URL('/api/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // API routes
    "/api/:path*",
    // Protected app routes
    "/events/:path*",
    "/locations/:path*",
    "/assets/:path*",
    "/licenses/:path*",
    "/people/:path*",
    // Add root and any other protected routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};