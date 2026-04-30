// app/api/orders/[orderId]/confirm/route.ts
import { withCORS } from '@/lib/cors/cors';
import { POST as confirmPOST } from './confirm.handler';

export const POST = withCORS(confirmPOST, 'http://127.0.0.1:5500');
export const OPTIONS = withCORS(async () => new Response(null, { status: 204 }), 'http://127.0.0.1:5500');