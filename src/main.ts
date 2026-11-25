import { createServer } from 'node:http';
import { handle } from './handler.js';
import { OrderStore } from './orders.js';

const port = Number(process.env['PORT'] ?? 3000);
const MAX_BODY = 10_000;
const store = new OrderStore();

createServer((req, res) => {
  const chunks: Buffer[] = [];
  let size = 0;
  req.on('data', (c: Buffer) => {
    size += c.length;
    if (size <= MAX_BODY) chunks.push(c);
  });
  req.on('end', () => {
    const result =
      size > MAX_BODY
        ? { status: 413, body: 'too large' }
        : handle(
            req.method ?? 'GET',
            req.url ?? '/',
            Buffer.concat(chunks).toString('utf8'),
            store,
          );
    res.writeHead(result.status, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(result.body);
  });
}).listen(port, () => {
  console.log(`listening on ${port}`);
});
