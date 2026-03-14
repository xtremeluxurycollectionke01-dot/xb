// app/api/categories/route.ts
import { withCORS } from '@/lib/cors/cors';
import { GET as categoriesGET } from './categories.handlers';

export const GET = withCORS(categoriesGET, 'http://127.0.0.1:5500');

export const OPTIONS = withCORS(
  async () => new Response(null, { status: 204 }),
  'http://127.0.0.1:5500'
);