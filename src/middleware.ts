import { NextRequest, NextResponse } from 'next/server';
import { getSession } from "@auth0/nextjs-auth0/edge";

const allowedOrigins = [
  'http://localhost:3000',
  'https://licenciacostarica.com',
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

  // Check for Auth0 session but don't block if missing
  // This allows Auth0 to work when session exists, but doesn't return 401 when it doesn't
  await getSession(request, NextResponse.next());

  // Allow all requests to continue (no blocking)
  const response = NextResponse.next();

  // Apply CORS headers to API routes
  if (pathname.startsWith('/api/')) {
    return applyCorsHeaders(response, request);
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/events", "/locations", "/assets", "/licenses", "/people"],
};