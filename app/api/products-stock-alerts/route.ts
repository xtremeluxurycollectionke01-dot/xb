import { withCORS } from '@/lib/cors/cors';
import { GET as alertsGET, PATCH as alertsPATCH } from './stock-alerts.handlers';

export const GET = withCORS(alertsGET, 'http://127.0.0.1:5500');

export const PATCH = withCORS(alertsPATCH, 'http://127.0.0.1:5500');

export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);