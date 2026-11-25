/** Build the greeting for a name. A missing or blank name greets the world. */
export function greet(name: string | null | undefined): string {
  const trimmed = name?.trim();
  return `Hello, ${trimmed ? trimmed : 'world'}!`;
}
