// app/api/staff/stats/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as statsGET } from './stats.handler';

// Use the same origin as your products endpoint
const allowedOrigin = 'http://127.0.0.1:5500';

export const GET = withCORS(statsGET, allowedOrigin);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), allowedOrigin);