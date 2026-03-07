// lib/cors.ts
/*import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest) => Promise<Response> | Response;

export function withCORS(handler: Handler, p0: string) {
  return async (req: NextRequest) => {
    const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : '';

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    const response = await handler(req);
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  };
}*/

// lib/cors.ts
/*import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest) => Promise<Response> | Response;

export function withCORS(handler: Handler, allowedOrigins: string | string[] = ['http://127.0.0.1:5500', 'http://localhost:5500']) {
  return async (req: NextRequest) => {
    const origins = Array.isArray(allowedOrigins) ? allowedOrigins : [allowedOrigins];
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = origins.includes(origin) ? origin : origins[0];

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400' // 24 hours
        }
      });
    }

    // Handle actual request
    const response = await handler(req);
    
    // Add CORS headers to response
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  };
}

// Helper to create CORS headers for custom responses
export function corsHeaders(origin: string = 'http://127.0.0.1:5500') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  };
}*/

// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest) => Promise<Response> | Response;

export function withCORS(handler: Handler, p0: string) {
  return async (req: NextRequest) => {
    const origin = req.headers.get('origin') || '';
    
    // More flexible origin matching - trim and check patterns
    const trimmedOrigin = origin.trim();
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://127.0.0.1:3000',
      'http://localhost:3000'
    ];
    
    // Check if origin is allowed (with trimming)
    const isAllowed = allowedOrigins.some(allowed => 
      trimmedOrigin === allowed || 
      trimmedOrigin.startsWith(allowed + '/') ||
      allowed.startsWith(trimmedOrigin + '/')
    );
    
    const allowedOrigin = isAllowed ? trimmedOrigin : allowedOrigins[0];
    
    // Log for debugging
    console.log(`[CORS] Request from origin: "${origin}"`);
    console.log(`[CORS] Trimmed origin: "${trimmedOrigin}"`);
    console.log(`[CORS] Allowed origin: "${allowedOrigin}"`);
    console.log(`[CORS] Method: ${req.method}`);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    try {
      // Handle actual request
      const response = await handler(req);
      
      // Add CORS headers to response
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

      return response;
    } catch (error) {
      console.error('[CORS Handler] Error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }
  };
}

// Helper for custom responses
export function corsHeaders(origin: string = '') {
  const trimmedOrigin = origin.trim();
  const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://localhost:3000'
  ];
  
  const isAllowed = allowedOrigins.some(allowed => 
    trimmedOrigin === allowed || 
    trimmedOrigin.startsWith(allowed + '/') ||
    allowed.startsWith(trimmedOrigin + '/')
  );
  
  const allowedOrigin = isAllowed ? trimmedOrigin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  };
}