// app/api/clients/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as clientsGET, POST as clientsPOST } from './clients.handler';

const allowedOrigin = 'http://127.0.0.1:5500';

export const GET = withCORS(clientsGET, allowedOrigin);
export const POST = withCORS(clientsPOST, allowedOrigin);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), allowedOrigin);