import { greet } from './greeting.js';
import { ORDER_ID, parseOrder, type OrderStore } from './orders.js';

export interface HttpResult {
  status: number;
  body: string;
}

const ROUTES = new Map([
  ['/healthz', 'GET'],
  ['/hello', 'GET'],
  ['/orders', 'POST'],
]);

/** Pure request handler: no sockets, so tests call it directly. The caller owns the store. */
export function handle(method: string, url: string, body: string, store: OrderStore): HttpResult {
  const { pathname, searchParams } = new URL(url, 'http://localhost');
  const orderId = pathname.startsWith('/orders/') ? pathname.slice('/orders/'.length) : undefined;
  const allowed = orderId === undefined ? ROUTES.get(pathname) : 'GET';
  if (!allowed) return { status: 404, body: 'not found' };
  if (method !== allowed) return { status: 405, body: 'method not allowed' };

  if (orderId !== undefined) {
    const order = ORDER_ID.test(orderId) ? store.get(orderId) : undefined;
    return order
      ? { status: 200, body: JSON.stringify(order) }
      : { status: 404, body: 'not found' };
  }
  switch (pathname) {
    case '/healthz':
      return { status: 200, body: 'ok' };
    case '/hello':
      return { status: 200, body: greet(searchParams.get('name')) };
    default: {
      let json: unknown;
      try {
        json = JSON.parse(body);
      } catch {
        return { status: 400, body: 'invalid json' };
      }
      const parsed = parseOrder(json);
      return parsed.ok
        ? { status: 201, body: JSON.stringify(store.create(parsed.value)) }
        : { status: 400, body: parsed.error };
    }
  }
}
