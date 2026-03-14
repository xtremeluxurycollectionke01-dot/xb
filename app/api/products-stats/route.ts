import { withCORS } from '@/lib/cors/cors';
import { GET as statsGET } from './stats.handlers';

export const GET = withCORS(statsGET, 'http://127.0.0.1:5500');

export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);