export interface Order {
  id: string;
  sku: string;
  quantity: number;
  cents: number;
}

export type OrderInput = { sku?: unknown; quantity?: unknown; cents?: unknown };

/** Validate untrusted input. Returns the order fields or a message for the caller. */
export function parseOrder(
  input: OrderInput,
): { ok: true; value: Omit<Order, 'id'> } | { ok: false; error: string } {
  const { sku, quantity, cents } = input;
  if (typeof sku !== 'string' || !/^[A-Z0-9-]{3,32}$/.test(sku))
    return { ok: false, error: 'sku must be 3 to 32 of A-Z, 0-9, -' };
  if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 100)
    return { ok: false, error: 'quantity must be an integer from 1 to 100' };
  if (!Number.isInteger(cents) || (cents as number) < 0)
    return { ok: false, error: 'cents must be a non-negative integer' };
  return { ok: true, value: { sku, quantity: quantity as number, cents: cents as number } };
}

/** In-memory store. A real service would swap this for a database behind the same interface. */
export class OrderStore {
  private readonly orders = new Map<string, Order>();
  private seq = 0;

  create(fields: Omit<Order, 'id'>): Order {
    const order = { id: `ord_${String(++this.seq).padStart(6, '0')}`, ...fields };
    this.orders.set(order.id, order);
    return order;
  }

  get(id: string): Order | undefined {
    return this.orders.get(id);
  }

  total(): number {
    let sum = 0;
    for (const o of this.orders.values()) sum += o.quantity * o.cents;
    return sum;
  }
}
