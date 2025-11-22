import { NextRequest, NextResponse } from 'next/server';
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

const allowedOrigins = [
  'http://localhost:3000',
  'https://licenciacostarica.com',
  'https://www.licenciacostarica.com'
];

function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
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

  // Handle actual request
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export default function middleware(request: NextRequest) {
  // Apply CORS middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return corsMiddleware(request);
  }

  // Apply Auth0 middleware for protected pages
  return withMiddlewareAuthRequired()(request);
}

export const config = {
  matcher: ["/api/:path*", "/events", "/locations", "/assets", "/licenses", "/people"],
};