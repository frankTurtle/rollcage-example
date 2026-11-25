import { describe, expect, it } from 'vitest';
import { handle } from '../src/handler.js';
import { OrderStore, parseOrder } from '../src/orders.js';

describe('parseOrder', () => {
  it('accepts a valid order', () => {
    expect(parseOrder({ sku: 'ABC-1', quantity: 2, cents: 500 })).toEqual({
      ok: true,
      value: { sku: 'ABC-1', quantity: 2, cents: 500 },
    });
  });
  it.each([
    [{ sku: 'x', quantity: 1, cents: 1 }],
    [{ sku: 'ABC-1', quantity: 0, cents: 1 }],
    [{ sku: 'ABC-1', quantity: 101, cents: 1 }],
    [{ sku: 'ABC-1', quantity: 1, cents: -1 }],
    [{ sku: 'ABC-1', quantity: 1.5, cents: 1 }],
  ])('rejects %j', (input) => {
    expect(parseOrder(input).ok).toBe(false);
  });
});

describe('orders over HTTP', () => {
  it('creates and fetches an order', () => {
    const store = new OrderStore();
    const created = handle(
      'POST',
      '/orders',
      JSON.stringify({ sku: 'ABC-1', quantity: 2, cents: 500 }),
      store,
    );
    expect(created.status).toBe(201);
    const { id } = JSON.parse(created.body) as { id: string };
    expect(handle('GET', `/orders/${id}`, '', store).status).toBe(200);
    expect(store.total()).toBe(1000);
  });
  it('returns 400 for bad json and bad fields', () => {
    expect(handle('POST', '/orders', '{').status).toBe(400);
    expect(handle('POST', '/orders', JSON.stringify({ sku: 'x' })).status).toBe(400);
  });
  it('returns 404 for a missing order and 405 for a wrong method', () => {
    expect(handle('GET', '/orders/ord_000099').status).toBe(404);
    expect(handle('DELETE', '/orders').status).toBe(405);
  });
});
