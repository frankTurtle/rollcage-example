import { describe, expect, it } from 'vitest';
import { handle } from '../src/handler.js';
import { OrderStore, parseOrder } from '../src/orders.js';

const good = { sku: 'ABC-1', quantity: 2, cents: 500 };

describe('parseOrder', () => {
  it('accepts a valid order', () => {
    expect(parseOrder(good)).toEqual({ ok: true, value: good });
  });
  it.each([
    [{ ...good, sku: 'x' }, 'sku'],
    [{ ...good, quantity: 0 }, 'quantity'],
    [{ ...good, quantity: 101 }, 'quantity'],
    [{ ...good, quantity: 1.5 }, 'quantity'],
    [{ ...good, cents: -1 }, 'cents'],
    [{ ...good, cents: '5' }, 'cents'],
    [{ ...good, cents: 1e12 }, 'cents'],
    [[], 'object'],
    [null, 'object'],
    ['x', 'object'],
  ])('rejects %j with a message naming %s', (input, field) => {
    const result = parseOrder(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(field);
  });
});

describe('orders over HTTP', () => {
  const post = (body: string, store = new OrderStore()) => handle('POST', '/orders', body, store);

  it('creates and fetches an order', () => {
    const store = new OrderStore();
    const created = post(JSON.stringify(good), store);
    expect(created.status).toBe(201);
    const { id } = JSON.parse(created.body) as { id: string };
    expect(handle('GET', `/orders/${id}`, '', store).status).toBe(200);
    expect(store.total()).toBe(1000);
  });
  it('returns 400 for bad json and bad fields', () => {
    expect(post('{').status).toBe(400);
    expect(post(JSON.stringify({ sku: 'x' })).status).toBe(400);
  });
  it('returns 404 for a missing or malformed order id, and 405 for a wrong method', () => {
    const store = new OrderStore();
    expect(handle('GET', '/orders/ord_000099', '', store).status).toBe(404);
    expect(handle('GET', '/orders/nope', '', store).status).toBe(404);
    expect(handle('DELETE', '/orders', '', store).status).toBe(405);
    expect(handle('POST', '/orders/ord_000001', '', store).status).toBe(405);
  });
});
