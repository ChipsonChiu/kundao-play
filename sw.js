'use strict';
const VERSION = 'v0.202', BUILD = '8c8f08041c106260242e2894186d875af6de26691d99f719e32bb43fc3d3aee9';
const PREFIX = 'kundao-shell-', CACHE = PREFIX + BUILD.slice(0, 16);
const SCOPE = self.registration.scope;
const SHELL = SCOPE + 'offline.html';
const FONTS = ['assets/fonts/kd-yuan.woff2', 'assets/fonts/kd-kai.woff2'].map(f => SCOPE + f);
const NAV_TIMEOUT = 8000;
let caching = null;
async function sha256(buf) { const d = await crypto.subtle.digest('SHA-256', buf); return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, '0')).join(''); }
async function shellOf(name) { if (!(await caches.has(name))) return null; return (await (await caches.open(name)).match(SHELL)) || null; }
async function hasShell() { return !!(await shellOf(CACHE)); }
async function optedIn() { for (const k of await caches.keys()) if (k.startsWith(PREFIX) && k !== CACHE && await shellOf(k)) return true; return false; }
function cacheShell() {
  if (!caching) caching = (async () => {
    try {
      if (await hasShell()) return true;
      const r = await fetch(SHELL, { cache: 'no-cache', credentials: 'same-origin' }); if (!r.ok) throw new Error('offline.html ' + r.status);
      const buf = await r.arrayBuffer(); if (await sha256(buf) !== BUILD) throw new Error('offline.html 和這一版的雜湊不同');
      const fonts = []; for (const f of FONTS) { const fr = await fetch(f, { cache: 'no-cache', credentials: 'same-origin' }); if (!fr.ok) throw new Error('font ' + fr.status); fonts.push([f, fr]); }
      const c = await caches.open(CACHE);
      for (const [f, fr] of fonts) await c.put(f, fr);
      await c.put(SHELL, new Response(buf, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
      return true;
    } finally { caching = null; }
  })();
  return caching;
}
async function state() { return (await hasShell()) ? 'ready' : (caching ? 'caching' : 'none'); }
async function tell(target) {
  const m = { type: 'kd-shell', state: await state(), version: VERSION, build: BUILD.slice(0, 16) };
  if (target) { target.postMessage(m); return; }
  for (const c of await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })) c.postMessage(m);
}
self.addEventListener('install', e => { e.waitUntil((async () => {
  if (await optedIn()) await cacheShell();
  await self.skipWaiting();
})()); });
self.addEventListener('activate', e => { e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith(PREFIX) && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
  await tell();
})()); });
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'kd-shell-status') e.waitUntil(tell(e.source));
  else if (d.type === 'kd-shell-cache') e.waitUntil((async () => {
    if (!(await hasShell())) { const p = cacheShell().catch(() => false); await tell(e.source); await p; }
    await tell();
  })());
});
function netFirst(url) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), NAV_TIMEOUT);
  return fetch(url, { cache: 'no-store', credentials: 'same-origin', signal: ac.signal }).then(r => { clearTimeout(t); return r.redirected ? new Response(r.body, { status: r.status, statusText: r.statusText, headers: r.headers }) : r; }, err => { clearTimeout(t); throw err; });
}
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  let rel;
  try { const u = new URL(req.url); if (u.origin !== self.location.origin || !u.href.startsWith(SCOPE)) return; rel = (u.origin + u.pathname).slice(SCOPE.length); } catch (err) { return; }
  if (req.mode === 'navigate') {
    if (rel === 'offline.html') e.respondWith((async () => { try { const r = await shellOf(CACHE); if (r) return r; } catch (err) {} return fetch(req); })());
    else if (rel === '' || rel === 'index.html') e.respondWith((async () => { try { return await netFirst(req.url); } catch (err) { let r = null; try { r = await shellOf(CACHE); } catch (e2) {} if (r) return r; throw err; } })());
    return;
  }
  if (FONTS.includes(SCOPE + rel)) e.respondWith((async () => { try { if (await caches.has(CACHE)) { const r = await (await caches.open(CACHE)).match(SCOPE + rel); if (r) return r; } } catch (err) {} return fetch(req); })());
});
