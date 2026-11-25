import { describe, expect, it } from 'vitest';
import { handle } from '../src/handler.js';
import { OrderStore } from '../src/orders.js';

const store = new OrderStore();

describe('handle', () => {
  it('answers the health check', () => {
    expect(handle('GET', '/healthz', '', store)).toEqual({ status: 200, body: 'ok' });
  });

  it('greets with the name query parameter', () => {
    expect(handle('GET', '/hello?name=Ada', '', store)).toEqual({
      status: 200,
      body: 'Hello, Ada!',
    });
  });

  it('returns 404 for an unknown path', () => {
    expect(handle('GET', '/nope', '', store).status).toBe(404);
  });

  it('returns 405 for a method other than GET', () => {
    expect(handle('POST', '/hello', '', store).status).toBe(405);
  });
});
