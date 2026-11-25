import { describe, expect, it } from 'vitest';
import { greet } from '../src/greeting.js';

describe('greet', () => {
  it('greets by name', () => {
    expect(greet('Ada')).toBe('Hello, Ada!');
  });

  it('trims the name', () => {
    expect(greet('  Ada  ')).toBe('Hello, Ada!');
  });

  it('greets the world when the name is missing or blank', () => {
    expect(greet(undefined)).toBe('Hello, world!');
    expect(greet(null)).toBe('Hello, world!');
    expect(greet('   ')).toBe('Hello, world!');
  });
});
