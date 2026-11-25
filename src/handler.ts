import { greet } from './greeting.js';
import { OrderStore, parseOrder } from './orders.js';

export interface HttpResult {
  status: number;
  body: string;
}

/** Pure request handler: no sockets, so tests call it directly. */
export function handle(
  method: string,
  url: string,
  body = '',
  store = new OrderStore(),
): HttpResult {
  const { pathname, searchParams } = new URL(url, 'http://localhost');
  if (pathname === '/healthz' && method === 'GET') return { status: 200, body: 'ok' };
  if (pathname === '/hello' && method === 'GET')
    return { status: 200, body: greet(searchParams.get('name')) };
  if (pathname === '/orders' && method === 'POST') {
    let json: unknown;
    try {
      json = JSON.parse(body);
    } catch {
      return { status: 400, body: 'invalid json' };
    }
    const parsed = parseOrder((json ?? {}) as Record<string, unknown>);
    if (!parsed.ok) return { status: 400, body: parsed.error };
    return { status: 201, body: JSON.stringify(store.create(parsed.value)) };
  }
  const match = /^\/orders\/(ord_\d{6})$/.exec(pathname);
  if (match && method === 'GET') {
    const order = store.get(match[1] as string);
    return order
      ? { status: 200, body: JSON.stringify(order) }
      : { status: 404, body: 'not found' };
  }
  return {
    status:
      pathname === '/healthz' || pathname === '/hello' || pathname === '/orders' || match
        ? 405
        : 404,
    body: 'not found or method not allowed',
  };
}
