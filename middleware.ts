// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://linkchemsupplies.co.ke',
  'https://www.linkchemsupplies.co.ke'
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check if origin is allowed
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin);
  const allowedOrigin = isAllowedOrigin ? origin : ALLOWED_ORIGINS[0];

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Type, X-Device-Fingerprint, X-Request-Id, X-Client-Version',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // For actual requests, add CORS headers to the response
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-Type, X-Device-Fingerprint, X-Request-Id, X-Client-Version');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Apply to API routes only
export const config = {
  matcher: '/api/:path*'
};