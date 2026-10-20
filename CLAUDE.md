# JBRS (JB Reporting System) - working notes for Claude

Online reporting system for Janata Bank PLC., Sirajganj Area (Area Office 5038 and 24 branches).
Owner: Md. Shaheen Mahmud, Principal Officer, Area Office, Sirajganj.
Live site: Cloudflare Pages project connected to this repository (production branch `main`).

## Layout
- `site/` - what Cloudflare serves. **Generated, do not edit by hand.**
  - `site/index.html` - the whole web app (one file, includes logo, Kalpurush font, calculator).
  - `site/_worker.js` - the server (Cloudflare Pages advanced mode). Needs a D1 binding named `DB`.
- `src/app_online.js` - online app: login, dashboard, reports, area views, admin, calculator bridge.
- `src/glance.js` - "At a glance (এক নজরে)" report: layout, Bangla digits, formulas, consolidation.
- `src/_worker.js` - server source (copied to `site/` by the build).
- `src/offline_base.html` - the offline JBRS file; the build takes styles, logo, menu tree,
  Sirajganj branch list and the embedded Interest Waiver Calculator (v3.4, base64) from it.
- `tools/patch_iwc.py` - turns the offline calculator into the online variant
  (removes offline-only options, register list layout, help text). Calculations are not changed.
- `tools/build.py` - builds `site/` from the sources. Run: `python3 tools/build.py`
- `tools/local_server.mjs` - local stand-in for Cloudflare Pages + D1 (Node's built-in SQLite).
  Run: `node tools/local_server.mjs /tmp/test.db` then open http://localhost:8787

## Rules
- Always run `python3 tools/build.py` after changing anything in `src/` or `tools/`, and commit `site/` too.
- Test in a browser against the local server before pushing (Playwright + Chromium are available).
- Work on a branch; Cloudflare gives every branch a preview link. Merge to `main` only when the owner says publish.
- Never change or drop database tables in a way that loses data. Tables are created with
  `CREATE TABLE IF NOT EXISTS` in `src/_worker.js`; add new columns/tables, do not rename.
- Report data and printouts are in Bangla (Unicode, Kalpurush font, Bangla digits).
- Printed reports: logo left of bank and branch name, no app name, no developer line, signature
  labels কর্মকর্তা / ব্যবস্থাপক (Area Office: অফিস প্রধান).
- Default password for office logins is 12345678. Admin login id is `admin`.
