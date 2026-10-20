// Local stand-in for Cloudflare Pages + D1, for testing only.
import http from 'node:http';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from '../site/_worker.js';

const dbFile = process.argv[2] || ':memory:';
const sq = new DatabaseSync(dbFile);
class Stmt {
  constructor(sql, args = []) { this.sql = sql; this.args = args; }
  bind(...a) { return new Stmt(this.sql, a); }
  async first() { return this._first(); }
  _first() { const r = sq.prepare(this.sql).get(...this.args); return r === undefined ? null : { ...r }; }
  async all() { return { results: sq.prepare(this.sql).all(...this.args).map(r => ({ ...r })) }; }
  async run() { const r = sq.prepare(this.sql).run(...this.args); return { meta: { changes: Number(r.changes) } }; }
}
const DB = {
  prepare: sql => new Stmt(sql),
  async batch(list) { sq.exec('BEGIN'); try { const out = []; for (const s of list) out.push(await s.run()); sq.exec('COMMIT'); return out; } catch (e) { sq.exec('ROLLBACK'); throw e; } }
};
const index = fs.readFileSync(new URL('../site/index.html', import.meta.url));
const ASSETS = { fetch: async () => new Response(index, { headers: { 'content-type': 'text/html; charset=utf-8' } }) };
const env = { DB, ASSETS };

http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request('http://localhost:8787' + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const t0 = performance.now();
  const r = await worker.fetch(request, env);
  const ms = performance.now() - t0;
  if (req.url.startsWith('/api/')) console.log(req.method, req.url.split('?')[0], r.status, ms.toFixed(1) + 'ms');
  res.writeHead(r.status, Object.fromEntries(r.headers));
  res.end(Buffer.from(await r.arrayBuffer()));
}).listen(8787, () => console.log('listening 8787'));
