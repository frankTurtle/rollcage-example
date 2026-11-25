export interface Order {
  id: string;
  sku: string;
  quantity: number;
  cents: number;
}

export type NewOrder = Omit<Order, 'id'>;

/** The id format lives here so the handler and the store cannot drift apart. */
export const ORDER_ID = /^ord_\d{6,}$/;

const MAX_CENTS = 100_000_000;

const isInt = (v: unknown, min: number, max: number): v is number =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= max;

/** Validate untrusted input. Returns the order fields or a message for the caller. */
export function parseOrder(
  input: unknown,
): { ok: true; value: NewOrder } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null || Array.isArray(input))
    return { ok: false, error: 'body must be a JSON object' };
  const { sku, quantity, cents } = input as Record<string, unknown>;
  if (typeof sku !== 'string' || !/^[A-Z0-9-]{3,32}$/.test(sku))
    return { ok: false, error: 'sku must be 3 to 32 of A-Z, 0-9, -' };
  if (!isInt(quantity, 1, 100))
    return { ok: false, error: 'quantity must be an integer from 1 to 100' };
  if (!isInt(cents, 0, MAX_CENTS))
    return { ok: false, error: `cents must be an integer from 0 to ${MAX_CENTS}` };
  return { ok: true, value: { sku, quantity, cents } };
}

/** In-memory store. A real service would swap this for a database behind the same interface. */
export class OrderStore {
  private readonly orders = new Map<string, Order>();
  private seq = 0;

  create(fields: NewOrder): Order {
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
