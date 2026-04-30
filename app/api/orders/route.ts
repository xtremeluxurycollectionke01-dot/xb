// app/api/orders/route.ts
import { withCORS } from '@/lib/cors/cors';
import { POST as ordersPOST, GET as ordersGET } from './order.handlers';

export const POST = withCORS(ordersPOST, 'http://127.0.0.1:5500');
export const GET = withCORS(ordersGET, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), 'http://127.0.0.1:5500');