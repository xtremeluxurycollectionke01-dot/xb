import { NextRequest, NextResponse } from 'next/server';
import { GET as productGET, PUT as productPUT, DELETE as productDELETE } from './products.handlers';

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000'
];

/*function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-app-type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}*/

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 
      'Content-Type, Authorization, X-App-Type, X-Device-Fingerprint',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}


// Wrapper function to add CORS headers to responses
async function withCORS(handler: Function, request: NextRequest, context: any) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Pass both request and context to the handler
    const response = await handler(request, context);
    
    // Add CORS headers to the response
    if (response instanceof NextResponse) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    } else if (response instanceof Response) {
      // If it's a regular Response, create a new NextResponse with headers
      const newResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
      return newResponse;
    }
    
    return response;
  } catch (error) {
    console.error('[CORS Wrapper] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// GET handler with CORS - receives both request and context
export async function GET(request: NextRequest, context: any) {
  return withCORS(productGET, request, context);
}

// PUT handler with CORS
export async function PUT(request: NextRequest, context: any) {
  return withCORS(productPUT, request, context);
}

// DELETE handler with CORS
export async function DELETE(request: NextRequest, context: any) {
  return withCORS(productDELETE, request, context);
}

// OPTIONS handler for preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}