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
/*import { NextRequest, NextResponse } from 'next/server';

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
}*/

// lib/cors.ts
/*import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest) => Promise<Response> | Response;

interface CORSOptions {
  allowedOrigins?: string[];
  allowCredentials?: boolean;
  allowedMethods?: string[];
  allowedHeaders?: string[];
  maxAge?: number;
}

export function withCORS(
  handler: Handler, 
  origins?: string | string[] | CORSOptions
) {
  return async (req: NextRequest) => {
    const origin = req.headers.get('origin') || '';
    
    // Default allowed origins
    const defaultOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://127.0.0.1:3000',
      'http://localhost:3000'
    ];

    // Parse options
    let allowedOrigins = defaultOrigins;
    let options: CORSOptions = {};

    if (origins) {
      if (typeof origins === 'string') {
        allowedOrigins = [origins];
      } else if (Array.isArray(origins)) {
        allowedOrigins = origins;
      } else {
        // It's a CORSOptions object
        options = origins;
        allowedOrigins = options.allowedOrigins || defaultOrigins;
      }
    }

    // More flexible origin matching - trim and check patterns
    const trimmedOrigin = origin.trim();
    
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
          'Access-Control-Allow-Methods': options.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': options.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': options.allowCredentials !== false ? 'true' : 'false',
          'Access-Control-Max-Age': (options.maxAge || 86400).toString()
        }
      });
    }

    try {
      // Handle actual request
      const response = await handler(req);
      
      // Add CORS headers to response
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', options.allowCredentials !== false ? 'true' : 'false');
      response.headers.set('Access-Control-Allow-Methods', options.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With');

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
            'Access-Control-Allow-Credentials': options.allowCredentials !== false ? 'true' : 'false'
          }
        }
      );
    }
  };
}

// Helper for custom responses
export function corsHeaders(origin: string = '', options?: CORSOptions) {
  const trimmedOrigin = origin.trim();
  const allowedOrigins = options?.allowedOrigins || [
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
    'Access-Control-Allow-Methods': options?.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': options?.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': options?.allowCredentials !== false ? 'true' : 'false',
    'Access-Control-Max-Age': (options?.maxAge || 86400).toString()
  };
}*/


// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

type Handler = (req: NextRequest) => Promise<Response> | Response;

interface CORSOptions {
  allowedOrigins?: string[];
  allowCredentials?: boolean;
  allowedMethods?: string[];
  allowedHeaders?: string[];
  maxAge?: number;
}

export function withCORS(
  handler: Handler, 
  origins?: string | string[] | CORSOptions
) {
  return async (req: NextRequest) => {
    const origin = req.headers.get('origin') || '';
    const appType = req.headers.get('x-app-type') || 'web';
    
    // Default allowed origins (expanded for desktop apps)
    const defaultOrigins = [
      // Web app origins
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://localhost:3001',
      
      // Desktop app origins
      'electron://localhost',
      'file://',
      'capacitor://localhost',
      'ionic://localhost',
      
      // Production origins
      'https://linkchemsupplies.co.ke',
      'https://www.linkchemsupplies.co.ke',
      
      // Allow local network IPs (regex patterns)
    ];

    // Parse options
    let allowedOrigins = defaultOrigins;
    let options: CORSOptions = {};

    if (origins) {
      if (typeof origins === 'string') {
        allowedOrigins = [origins];
      } else if (Array.isArray(origins)) {
        allowedOrigins = origins;
      } else {
        options = origins;
        allowedOrigins = options.allowedOrigins || defaultOrigins;
      }
    }

    // More flexible origin matching
    const trimmedOrigin = origin.trim();
    
    // Check if origin is allowed (with pattern matching)
    const isAllowed = isOriginAllowed(trimmedOrigin, allowedOrigins);
    
    const allowedOrigin = isAllowed ? trimmedOrigin : (allowedOrigins.find(o => o.startsWith('http')) || allowedOrigins[0]);
    
    // Log for debugging
    console.log(`[CORS] Request from origin: "${origin}"`);
    console.log(`[CORS] App Type: ${appType}`);
    console.log(`[CORS] Allowed origin: "${allowedOrigin}"`);
    console.log(`[CORS] Method: ${req.method}`);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      const headers: Record<string, string> = {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': options.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': options.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With, X-App-Type, X-Device-Fingerprint',
        'Access-Control-Allow-Credentials': options.allowCredentials !== false ? 'true' : 'false',
        'Access-Control-Max-Age': (options.maxAge || 86400).toString()
      };
      
      // For desktop apps, also add these headers
      if (appType === 'electron') {
        headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range';
      }
      
      return new Response(null, {
        status: 204,
        headers
      });
    }

    try {
      // Handle actual request
      const response = await handler(req);
      
      // Add CORS headers to response
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Credentials', options.allowCredentials !== false ? 'true' : 'false');
      response.headers.set('Access-Control-Allow-Methods', options.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With, X-App-Type, X-Device-Fingerprint');
      
      // For desktop apps, expose additional headers
      if (appType === 'electron') {
        response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
      }

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
            'Access-Control-Allow-Credentials': options.allowCredentials !== false ? 'true' : 'false'
          }
        }
      );
    }
  };
}

// Helper function to check if origin is allowed (supports patterns and regex)
function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  // Direct match
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check for electron origins
  if (origin === 'electron://localhost' || origin === 'file://' || origin.startsWith('capacitor://')) {
    return true;
  }
  
  // Check for local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  const localIpPatterns = [
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(?::\d+)?$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}(?::\d+)?$/,
    /^https:\/\/192\.168\.\d{1,3}\.\d{1,3}(?::\d+)?$/,
    /^https:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$/,
  ];
  
  for (const pattern of localIpPatterns) {
    if (pattern.test(origin)) {
      return true;
    }
  }
  
  // Check for wildcard patterns
  for (const allowed of allowedOrigins) {
    if (allowed.includes('*')) {
      const regexPattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(origin)) {
        return true;
      }
    }
    
    // Check if origin starts with allowed (for subdomains)
    if (allowed.startsWith('https://') && origin.startsWith(allowed)) {
      return true;
    }
    
    // Check if allowed starts with origin
    if (origin.startsWith(allowed) && allowed !== '') {
      return true;
    }
  }
  
  return false;
}

// Helper for custom responses
export function corsHeaders(origin: string = '', options?: CORSOptions) {
  const trimmedOrigin = origin.trim();
  const allowedOrigins = options?.allowedOrigins || [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'electron://localhost',
    'file://',
    'capacitor://localhost'
  ];
  
  const isAllowed = isOriginAllowed(trimmedOrigin, allowedOrigins);
  const allowedOrigin = isAllowed ? trimmedOrigin : allowedOrigins.find(o => o.startsWith('http')) || allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': options?.allowedMethods?.join(', ') || 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': options?.allowedHeaders?.join(', ') || 'Content-Type, Authorization, X-Requested-With, X-App-Type, X-Device-Fingerprint',
    'Access-Control-Allow-Credentials': options?.allowCredentials !== false ? 'true' : 'false',
    'Access-Control-Max-Age': (options?.maxAge || 86400).toString(),
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
  };
}

// Special CORS for Electron desktop app
export function withElectronCORS(handler: Handler) {
  return withCORS(handler, {
    allowedOrigins: [
      'electron://localhost',
      'file://',
      'capacitor://localhost',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    allowCredentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-App-Type', 'X-Device-Fingerprint']
  });
}

// Special CORS for web app
export function withWebCORS(handler: Handler) {
  return withCORS(handler, {
    allowedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://linkchemsupplies.co.ke'
    ],
    allowCredentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-App-Type', 'X-Device-Fingerprint']
  });
}