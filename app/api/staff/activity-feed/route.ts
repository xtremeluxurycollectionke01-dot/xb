// app/api/staff/activity-feed/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as feedGET } from './activity-feed.handler';

const allowedOrigin = 'http://127.0.0.1:5500';

export const GET = withCORS(feedGET, allowedOrigin);
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), allowedOrigin);