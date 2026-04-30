// app/api/clients/top/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as topGET } from './top.handler';

const allowedOrigin = 'http://127.0.0.1:5500';

export const GET = withCORS(topGET, allowedOrigin);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), allowedOrigin);