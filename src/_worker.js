// JBRS Online server - Cloudflare Pages (advanced mode _worker.js)
// Needs one D1 database binding named DB. Tables are created automatically.
// Passwords never reach this server in plain form: the browser stretches them
// (PBKDF2, 150,000 rounds) and the server stores only a SHA-256 of that result.

const IDLE_MIN = 30;          // session ends after 30 minutes without activity
const MAX_HOURS = 12;         // and always after 12 hours
const MAX_FAILS = 5, LOCK_MIN = 15;
const MAX_DATA = 300000;      // max report size in bytes

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS offices(code TEXT PRIMARY KEY,name TEXT,name_bn TEXT,level TEXT,parent TEXT)`,
  `CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,office TEXT,role TEXT,name TEXT,hash TEXT,is_default INTEGER DEFAULT 1,active INTEGER DEFAULT 1,created TEXT,last_login TEXT)`,
  `CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user TEXT,created INTEGER,last INTEGER)`,
  `CREATE TABLE IF NOT EXISTS reports(office TEXT,leaf TEXT,period TEXT,status TEXT,data TEXT,note TEXT,updated TEXT,updated_by TEXT,submitted TEXT,PRIMARY KEY(office,leaf,period))`,
  `CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,at TEXT,user TEXT,action TEXT,detail TEXT)`,
  `CREATE TABLE IF NOT EXISTS fails(k TEXT PRIMARY KEY,n INTEGER,until INTEGER)`,
  `CREATE TABLE IF NOT EXISTS iwc_state(office TEXT,k TEXT,v TEXT,updated TEXT,PRIMARY KEY(office,k))`,
  `CREATE TABLE IF NOT EXISTS iwc_cases(office TEXT,key TEXT,name TEXT,acct TEXT,lt TEXT,saved TEXT,item TEXT,updated TEXT,updated_by TEXT,PRIMARY KEY(office,key))`
];
const IWC_STATE_KEYS = ['exit-policy-v3', 'iw-typemap', 'iw-lang'];
const MAX_IWC = 600000;
let ready = false;
async function init(db) {
  if (ready) return;
  await db.batch(SCHEMA.map(s => db.prepare(s)));
  ready = true;
}

const te = new TextEncoder();
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
async function sha(s) { return hex(await crypto.subtle.digest('SHA-256', te.encode(s))); }
const hashKey = (key, env) => sha('JBRS|' + (env.PEPPER || '') + '|' + key);
function same(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
const now = () => Date.now();
const iso = () => new Date().toISOString();
const ID_RE = /^[A-Za-z0-9._-]{2,20}$/;
const LEAF_RE = /^[a-z0-9_]{2,30}$/;
const PERIOD_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const KEY_RE = /^[A-Za-z0-9+/=]{40,64}$/;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store',
    'x-content-type-options': 'nosniff' } });
}
const err = (msg, status = 400) => json({ error: msg }, status);
async function body(req) { const t = await req.text(); if (t.length > MAX_DATA + 5000) throw new Error('Too large'); return t ? JSON.parse(t) : {}; }
async function audit(db, user, action, detail) {
  await db.prepare('INSERT INTO audit(at,user,action,detail) VALUES(?,?,?,?)').bind(iso(), user || '-', action, detail || '').run();
}

async function session(req, db) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const s = await db.prepare('SELECT * FROM sessions WHERE token=?').bind(token).first();
  if (!s) return null;
  const t = now();
  if (t - s.last > IDLE_MIN * 60000 || t - s.created > MAX_HOURS * 3600000) {
    await db.prepare('DELETE FROM sessions WHERE token=?').bind(token).run(); return null;
  }
  const u = await db.prepare('SELECT id,office,role,name,is_default,active FROM users WHERE id=?').bind(s.user).first();
  if (!u || !u.active) return null;
  await db.prepare('UPDATE sessions SET last=? WHERE token=?').bind(t, token).run();
  u.token = token;
  return u;
}

// Which offices may this user read? ADMIN: all. AREA/DIV: own + everything below. BRANCH: own.
async function readable(db, u) {
  if (u.role === 'ADMIN') return null; // null = all
  const all = (await db.prepare('SELECT code,parent FROM offices').all()).results;
  const out = new Set([u.office]);
  if (u.role === 'AREA') {
    let grew = true;
    while (grew) { grew = false; for (const o of all) if (o.parent && out.has(o.parent) && !out.has(o.code)) { out.add(o.code); grew = true; } }
  }
  return out;
}
async function canRead(db, u, office) { const r = await readable(db, u); return r === null || r.has(office); }

async function handle(req, env) {
  const db = env.DB;
  if (!db) return err('Database not connected. Add a D1 binding named DB in the Pages project settings.', 500);
  await init(db);
  const url = new URL(req.url);
  const p = url.pathname.replace(/^\/api/, '');
  const m = req.method;

  // ---------- public ----------
  if (p === '/status' && m === 'GET') {
    const c = await db.prepare('SELECT COUNT(*) AS n FROM users').first();
    return json({ ok: true, needsSetup: !c.n, version: 1 });
  }
  if (p === '/setup' && m === 'POST') {
    const c = await db.prepare('SELECT COUNT(*) AS n FROM users').first();
    if (c.n) return err('Setup has already been done.', 403);
    const b = await body(req);
    if (env.SETUP_KEY && b.setupKey !== env.SETUP_KEY) return err('Wrong setup key.', 403);
    if (!Array.isArray(b.offices) || !Array.isArray(b.users) || b.users.length > 500) return err('Bad setup data.');
    const st = [];
    for (const o of b.offices) {
      if (!ID_RE.test(o.code) || !['HO', 'DIV', 'AREA', 'BR'].includes(o.level)) return err('Bad office ' + o.code);
      st.push(db.prepare('INSERT OR REPLACE INTO offices(code,name,name_bn,level,parent) VALUES(?,?,?,?,?)').bind(o.code, String(o.name || '').slice(0, 120), String(o.name_bn || '').slice(0, 120), o.level, o.parent || null));
    }
    if (!b.users.some(u => u.role === 'ADMIN')) return err('An admin login is required.');
    for (const u of b.users) {
      if (!ID_RE.test(u.id) || !KEY_RE.test(u.key) || !['ADMIN', 'AREA', 'BRANCH'].includes(u.role)) return err('Bad user ' + u.id);
      st.push(db.prepare('INSERT INTO users(id,office,role,name,hash,is_default,active,created) VALUES(?,?,?,?,?,?,1,?)').bind(u.id.toLowerCase(), u.office || null, u.role, String(u.name || '').slice(0, 120), await hashKey(u.key, env), u.is_default ? 1 : 0, iso()));
    }
    await db.batch(st);
    await audit(db, 'setup', 'setup', b.offices.length + ' offices, ' + b.users.length + ' users');
    return json({ ok: true });
  }
  if (p === '/login' && m === 'POST') {
    const b = await body(req);
    const id = String(b.id || '').toLowerCase();
    if (!ID_RE.test(id) || !KEY_RE.test(String(b.key || ''))) return err('Wrong code or password.', 401);
    const f = await db.prepare('SELECT * FROM fails WHERE k=?').bind(id).first();
    if (f && f.until > now()) return err('Too many wrong attempts. Try again after ' + Math.ceil((f.until - now()) / 60000) + ' minutes.', 429);
    const u = await db.prepare('SELECT * FROM users WHERE id=?').bind(id).first();
    const ok = u && same(u.hash, await hashKey(b.key, env));
    if (!ok) {
      const n = (f && f.until <= now() && f.n >= MAX_FAILS ? 0 : (f ? f.n : 0)) + 1;
      const until = n >= MAX_FAILS ? now() + LOCK_MIN * 60000 : 0;
      await db.prepare('INSERT OR REPLACE INTO fails(k,n,until) VALUES(?,?,?)').bind(id, n >= MAX_FAILS ? 0 : n, until).run();
      if (until) await audit(db, id, 'locked', 'too many wrong passwords');
      return err(until ? 'Too many wrong attempts. Locked for ' + LOCK_MIN + ' minutes.' : 'Wrong code or password. ' + (MAX_FAILS - n) + ' attempts left.', 401);
    }
    if (!u.active) return err('This login has been disabled by the admin.', 403);
    await db.prepare('DELETE FROM fails WHERE k=?').bind(id).run();
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    await db.batch([
      db.prepare('INSERT INTO sessions(token,user,created,last) VALUES(?,?,?,?)').bind(token, u.id, now(), now()),
      db.prepare('UPDATE users SET last_login=? WHERE id=?').bind(iso(), u.id),
      db.prepare('DELETE FROM sessions WHERE last<?').bind(now() - MAX_HOURS * 3600000)
    ]);
    await audit(db, u.id, 'login', '');
    return json({ token });
  }

  // ---------- logged in ----------
  const u = await session(req, db);
  if (!u) return err('Please log in again.', 401);

  if (p === '/me' && m === 'GET') {
    const offices = (await db.prepare('SELECT code,name,name_bn,level,parent FROM offices').all()).results;
    return json({ user: { id: u.id, office: u.office, role: u.role, name: u.name, is_default: u.is_default }, offices });
  }
  if (p === '/logout' && m === 'POST') {
    await db.prepare('DELETE FROM sessions WHERE token=?').bind(u.token).run();
    return json({ ok: true });
  }
  if (p === '/password' && m === 'POST') {
    const b = await body(req);
    if (!KEY_RE.test(String(b.oldKey || '')) || !KEY_RE.test(String(b.newKey || ''))) return err('Bad request.');
    const row = await db.prepare('SELECT hash FROM users WHERE id=?').bind(u.id).first();
    if (!same(row.hash, await hashKey(b.oldKey, env))) return err('Current password is wrong.', 403);
    await db.batch([
      db.prepare('UPDATE users SET hash=?,is_default=0 WHERE id=?').bind(await hashKey(b.newKey, env), u.id),
      db.prepare('DELETE FROM sessions WHERE user=? AND token<>?').bind(u.id, u.token)
    ]);
    await audit(db, u.id, 'password changed', '');
    return json({ ok: true });
  }

  // list reports (metadata, no data)
  if (p === '/reports' && m === 'GET') {
    const leaf = url.searchParams.get('leaf'), period = url.searchParams.get('period'), office = url.searchParams.get('office');
    if (!LEAF_RE.test(leaf || '')) return err('Bad report type.');
    let q = 'SELECT office,leaf,period,status,note,updated,updated_by,submitted FROM reports WHERE leaf=?'; const a = [leaf];
    if (period) { if (!PERIOD_RE.test(period)) return err('Bad period.'); q += ' AND period=?'; a.push(period); }
    if (office) { if (!ID_RE.test(office)) return err('Bad office.'); q += ' AND office=?'; a.push(office); }
    const rows = (await db.prepare(q + ' ORDER BY period DESC').bind(...a).all()).results;
    const r = await readable(db, u);
    return json({ reports: rows.filter(x => r === null || r.has(x.office)) });
  }
  // one report with data
  if (p === '/report' && m === 'GET') {
    const office = url.searchParams.get('office'), leaf = url.searchParams.get('leaf'), period = url.searchParams.get('period');
    if (!ID_RE.test(office || '') || !LEAF_RE.test(leaf || '') || !PERIOD_RE.test(period || '')) return err('Bad request.');
    if (!await canRead(db, u, office)) return err('Not allowed.', 403);
    const row = await db.prepare('SELECT * FROM reports WHERE office=? AND leaf=? AND period=?').bind(office, leaf, period).first();
    if (!row) return json({ report: null });
    // Higher offices see another office's figures only after that office submits.
    if (office !== u.office && row.status !== 'SUBMITTED' && u.role !== 'ADMIN') row.data = null;
    else row.data = row.data ? JSON.parse(row.data) : null;
    return json({ report: row });
  }
  // save draft (own office only)
  if (p === '/report' && m === 'PUT') {
    const b = await body(req);
    if (!LEAF_RE.test(b.leaf || '') || !PERIOD_RE.test(b.period || '')) return err('Bad request.');
    if (u.role === 'ADMIN' || !u.office) return err('The admin login cannot enter reports.', 403);
    const data = JSON.stringify(b.data || {});
    if (data.length > MAX_DATA) return err('Report is too large.');
    const row = await db.prepare('SELECT status FROM reports WHERE office=? AND leaf=? AND period=?').bind(u.office, b.leaf, b.period).first();
    if (row && row.status === 'SUBMITTED') return err('This report is already submitted. Ask the Area Office to return it for correction.', 409);
    await db.prepare(`INSERT INTO reports(office,leaf,period,status,data,note,updated,updated_by) VALUES(?,?,?,'DRAFT',?,NULL,?,?)
      ON CONFLICT(office,leaf,period) DO UPDATE SET data=excluded.data,updated=excluded.updated,updated_by=excluded.updated_by,status=CASE WHEN reports.status='RETURNED' THEN 'RETURNED' ELSE 'DRAFT' END`)
      .bind(u.office, b.leaf, b.period, data, iso(), u.id).run();
    return json({ ok: true, updated: iso() });
  }
  if (p === '/report/submit' && m === 'POST') {
    const b = await body(req);
    if (!LEAF_RE.test(b.leaf || '') || !PERIOD_RE.test(b.period || '')) return err('Bad request.');
    const row = await db.prepare('SELECT status FROM reports WHERE office=? AND leaf=? AND period=?').bind(u.office, b.leaf, b.period).first();
    if (!row) return err('Save the report first.');
    if (row.status === 'SUBMITTED') return err('Already submitted.', 409);
    await db.prepare("UPDATE reports SET status='SUBMITTED',submitted=?,note=NULL WHERE office=? AND leaf=? AND period=?").bind(iso(), u.office, b.leaf, b.period).run();
    await audit(db, u.id, 'submitted', b.leaf + ' ' + b.period);
    return json({ ok: true });
  }
  if (p === '/report/return' && m === 'POST') {
    const b = await body(req);
    if (!ID_RE.test(b.office || '') || !LEAF_RE.test(b.leaf || '') || !PERIOD_RE.test(b.period || '')) return err('Bad request.');
    if (b.office === u.office || u.role === 'BRANCH' || !await canRead(db, u, b.office)) return err('Not allowed.', 403);
    const note = String(b.note || '').trim().slice(0, 500);
    if (!note) return err('Write the reason for returning.');
    const r = await db.prepare("UPDATE reports SET status='RETURNED',note=? WHERE office=? AND leaf=? AND period=? AND status='SUBMITTED'").bind(note, b.office, b.leaf, b.period).run();
    if (!r.meta || !r.meta.changes) return err('Only a submitted report can be returned.', 409);
    await audit(db, u.id, 'returned', b.office + ' ' + b.leaf + ' ' + b.period + ': ' + note);
    return json({ ok: true });
  }
  // all submitted reports under this office, with data (for consolidation and Excel)
  if (p === '/collect' && m === 'GET') {
    const leaf = url.searchParams.get('leaf'), period = url.searchParams.get('period');
    if (!LEAF_RE.test(leaf || '') || !PERIOD_RE.test(period || '')) return err('Bad request.');
    const rows = (await db.prepare("SELECT office,status,data,updated,submitted FROM reports WHERE leaf=? AND period=? AND status='SUBMITTED'").bind(leaf, period).all()).results;
    const r = await readable(db, u);
    return json({ reports: rows.filter(x => x.office !== u.office && (r === null || r.has(x.office))).map(x => ({ ...x, data: JSON.parse(x.data || '{}') })) });
  }

  // ---------- interest waiver calculator (register cases + working form) ----------
  if (p === '/iwc/load' && m === 'GET') {
    if (!u.office) return json({ state: {}, items: [] });
    const st = (await db.prepare('SELECT k,v FROM iwc_state WHERE office=?').bind(u.office).all()).results;
    const it = (await db.prepare('SELECT item FROM iwc_cases WHERE office=? ORDER BY name').bind(u.office).all()).results;
    return json({ state: Object.fromEntries(st.map(x => [x.k, x.v])), items: it.map(x => JSON.parse(x.item)) });
  }
  if (p === '/iwc/state' && m === 'PUT') {
    if (!u.office) return err('The admin login has no calculator of its own.', 403);
    const b = await body(req);
    if (!IWC_STATE_KEYS.includes(b.k) || typeof b.v !== 'string' || b.v.length > MAX_IWC) return err('Bad request.');
    await db.prepare('INSERT OR REPLACE INTO iwc_state(office,k,v,updated) VALUES(?,?,?,?)').bind(u.office, b.k, b.v, iso()).run();
    return json({ ok: true });
  }
  if (p === '/iwc/case' && m === 'PUT') {
    if (!u.office) return err('The admin login has no calculator of its own.', 403);
    const b = await body(req); const it = b.item;
    if (!it || typeof it.key !== 'string' || !it.key || it.key.length > 120) return err('Bad case.');
    const s = JSON.stringify(it); if (s.length > MAX_IWC) return err('This case is too large to save online.');
    const isNew = !(await db.prepare('SELECT 1 AS x FROM iwc_cases WHERE office=? AND key=?').bind(u.office, it.key).first());
    await db.prepare('INSERT OR REPLACE INTO iwc_cases(office,key,name,acct,lt,saved,item,updated,updated_by) VALUES(?,?,?,?,?,?,?,?,?)')
      .bind(u.office, it.key, String(it.name || '').slice(0, 200), String(it.acct || '').slice(0, 60), String(it.lt || '').slice(0, 5), String(it.saved || ''), s, iso(), u.id).run();
    if (isNew) await audit(db, u.id, 'calculator case added', String(it.acct || it.key).slice(0, 60));
    return json({ ok: true });
  }
  if (p === '/iwc/delete' && m === 'POST') {
    if (!u.office) return err('Not allowed.', 403);
    const b = await body(req);
    if (typeof b.key !== 'string' || !b.key) return err('Bad request.');
    await db.prepare('DELETE FROM iwc_cases WHERE office=? AND key=?').bind(u.office, b.key).run();
    await audit(db, u.id, 'calculator case removed', String(b.key).slice(0, 60));
    return json({ ok: true });
  }
  if ((p === '/iwc/cases' || p === '/iwc/items') && m === 'GET') {
    const office = url.searchParams.get('office') || 'all';
    if (office !== 'all' && !ID_RE.test(office)) return err('Bad office.');
    const r = await readable(db, u);
    const full = p === '/iwc/items';
    let q = 'SELECT office,key,name,acct,lt,saved,updated' + (full ? ',item' : '') + ' FROM iwc_cases'; const a = [];
    if (office !== 'all') { if (r !== null && !r.has(office)) return err('Not allowed.', 403); q += ' WHERE office=?'; a.push(office); }
    const rows = (await db.prepare(q + ' ORDER BY office,name').bind(...a).all()).results.filter(x => r === null || r.has(x.office));
    return json({ cases: rows.map(x => full ? { office: x.office, item: JSON.parse(x.item) } : x) });
  }

  // ---------- admin ----------
  if (p.startsWith('/admin/')) {
    if (u.role !== 'ADMIN') return err('Admin only.', 403);
    if (p === '/admin/users' && m === 'GET') {
      return json({ users: (await db.prepare('SELECT id,office,role,name,is_default,active,last_login FROM users ORDER BY role,id').all()).results });
    }
    if (p === '/admin/reset' && m === 'POST') {
      const b = await body(req);
      const id = String(b.id || '').toLowerCase();
      if (!ID_RE.test(id) || !KEY_RE.test(String(b.key || ''))) return err('Bad request.');
      const r = await db.prepare('UPDATE users SET hash=?,is_default=1 WHERE id=?').bind(await hashKey(b.key, env), id).run();
      if (!r.meta || !r.meta.changes) return err('No such login.', 404);
      await db.batch([db.prepare('DELETE FROM sessions WHERE user=?').bind(id), db.prepare('DELETE FROM fails WHERE k=?').bind(id)]);
      await audit(db, u.id, 'password reset', id);
      return json({ ok: true });
    }
    if (p === '/admin/active' && m === 'POST') {
      const b = await body(req);
      const id = String(b.id || '').toLowerCase();
      if (!ID_RE.test(id) || id === u.id) return err('Bad request.');
      await db.prepare('UPDATE users SET active=? WHERE id=?').bind(b.active ? 1 : 0, id).run();
      if (!b.active) await db.prepare('DELETE FROM sessions WHERE user=?').bind(id).run();
      await audit(db, u.id, b.active ? 'enabled' : 'disabled', id);
      return json({ ok: true });
    }
    if (p === '/admin/import' && m === 'POST') {
      const b = await body(req);
      if (!Array.isArray(b.items) || b.items.length > 200) return err('Bad import.');
      const offices = new Set((await db.prepare('SELECT code FROM offices').all()).results.map(x => x.code));
      let added = 0, skipped = 0;
      for (const it of b.items) {
        if (!offices.has(it.office) || !LEAF_RE.test(it.leaf || '') || !PERIOD_RE.test(it.period || '') || !['DRAFT', 'SUBMITTED'].includes(it.status)) return err('Bad import item for ' + it.office);
        const data = JSON.stringify(it.data || {});
        if (data.length > MAX_DATA) return err('Import item too large.');
        const r = await db.prepare('INSERT OR IGNORE INTO reports(office,leaf,period,status,data,note,updated,updated_by,submitted) VALUES(?,?,?,?,?,NULL,?,?,?)')
          .bind(it.office, it.leaf, it.period, it.status, data, iso(), 'import', it.status === 'SUBMITTED' ? iso() : null).run();
        if (r.meta && r.meta.changes) added++; else skipped++;
      }
      await audit(db, u.id, 'import', added + ' added, ' + skipped + ' kept');
      return json({ ok: true, added, skipped });
    }
    if (p === '/admin/audit' && m === 'GET') {
      return json({ audit: (await db.prepare('SELECT at,user,action,detail FROM audit ORDER BY id DESC LIMIT 300').all()).results });
    }
  }
  return err('Not found.', 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await handle(req, env); }
      catch (e) { return err('Server error: ' + (e && e.message ? e.message : e), 500); }
    }
    const res = await env.ASSETS.fetch(req);
    const h = new Headers(res.headers);
    h.set('x-frame-options', 'SAMEORIGIN');
    h.set('x-content-type-options', 'nosniff');
    h.set('referrer-policy', 'no-referrer');
    h.set('cache-control', 'no-cache');
    return new Response(res.body, { status: res.status, headers: h });
  }
};
