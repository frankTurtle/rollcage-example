import { createServer } from 'node:http';
import { handle } from './handler.js';
import { OrderStore } from './orders.js';

const port = Number(process.env['PORT'] ?? 3000);
const store = new OrderStore();

createServer((req, res) => {
  const chunks: Buffer[] = [];
  let size = 0;
  req.on('data', (c: Buffer) => {
    size += c.length;
    if (size <= 10_000) chunks.push(c);
  });
  req.on('end', () => {
    const { status, body } =
      size > 10_000
        ? { status: 413, body: 'too large' }
        : handle(
            req.method ?? 'GET',
            req.url ?? '/',
            Buffer.concat(chunks).toString('utf8'),
            store,
          );
    res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(body);
  });
}).listen(port, () => {
  console.log(`listening on ${port}`);
});
