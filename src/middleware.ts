import { NextRequest, NextResponse } from 'next/server';
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

const allowedOrigins = [
  'http://localhost:3000',
  'https://licenciacostarica.com',
  'https://www.licenciacostarica.com'
];

export default withMiddlewareAuthRequired(async function middleware(request: NextRequest) {
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

  // Continue with Auth0 protection for all routes
  const response = NextResponse.next();

  // Apply CORS headers to API routes after auth
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  return response;
});

export const config = {
  matcher: ["/api/:path*", "/events", "/locations", "/assets", "/licenses", "/people"],
};