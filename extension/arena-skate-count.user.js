// ==UserScript==
// @name         Arena Skate Count
// @namespace    https://github.com/slopyright-ai/ArenaSkateCount
// @version      1.0.0
// @description  Shows the registered count on DaySmart Dash sessions that have no capacity set (e.g. Public Skate), where the page leaves it out.
// @license      MIT
// @homepageURL  https://github.com/slopyright-ai/ArenaSkateCount
// @downloadURL  https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js
// @updateURL    https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js
// @match        https://apps.daysmartrecreation.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Arena Skate Count - MIT License - https://github.com/slopyright-ai/ArenaSkateCount
// Unofficial. Not affiliated with or endorsed by DaySmart or any facility.
//
// This one file is used three ways: as the Chrome extension's content script,
// as a userscript (Tampermonkey, Violentmonkey, Userscripts), and as the source
// of the bookmarklet (see tools/build-bookmarklet.sh).
//
// How it works: the Dash calendar already asks the API for each session's
// summary, which includes registered_count. The page only draws the
// "5/30 Registered" label when the session has a capacity, so sessions with
// capacity 0 show nothing. This script watches for the page's own events
// requests, repeats them, and fills in the missing label.

(() => {
  'use strict';
  if (window.__arenaSkateCount) return;
  window.__arenaSkateCount = true;

  const API_RE = /^https:\/\/api\.daysmartrecreation\.com\/v1\/events(\?|$)/;
  const LABEL_SEL = 'div.text-muted.text-small.text-right.mr-2';
  const MARK = 'data-dash-reg-count';
  const REFETCH_MS = 5000;

  const byKey = new Map();     // "YYYY-MM-DD|startMin|endMin" -> Map(id -> record)
  const lastFetch = new Map(); // url -> timestamp

  // ---------- data ----------

  const minutes = (iso) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));

  function store(json) {
    if (!json || !Array.isArray(json.data)) return;
    const inc = new Map();
    for (const i of json.included || []) inc.set(i.type + ':' + i.id, i.attributes || {});

    for (const ev of json.data) {
      const a = ev.attributes || {};
      const sum = inc.get('event-summaries:' + ev.id);
      if (!sum || typeof sum.registered_count !== 'number' || !a.start || !a.end) continue;

      const rel = ev.relationships || {};
      const resId = rel.resource && rel.resource.data && rel.resource.data.id;
      const areaId = rel.resourceArea && rel.resourceArea.data && rel.resourceArea.data.id;
      const key = a.start.slice(0, 10) + '|' + minutes(a.start) + '|' + minutes(a.end);

      if (!byKey.has(key)) byKey.set(key, new Map());
      byKey.get(key).set(ev.id, {
        id: ev.id,
        title: (a.desc || sum.name || '').trim(),
        resource: ((inc.get('resources:' + resId) || {}).name || '').trim(),
        area: ((inc.get('resource-areas:' + areaId) || {}).name || '').trim(),
        registered: sum.registered_count,
        capacity: Number(a.register_capacity) || Number(sum.composite_capacity) || 0,
      });
    }
  }

  async function refetch(url) {
    const now = Date.now();
    if (now - (lastFetch.get(url) || 0) < REFETCH_MS) return;
    lastFetch.set(url, now);

    let target = url;
    try {
      const u = new URL(url);
      const include = u.searchParams.get('include') || '';
      if (!include.split(',').includes('summary')) {
        u.searchParams.set('include', include ? include + ',summary' : 'summary');
        target = u.toString();
      }
    } catch (e) { /* use the url as-is */ }

    try {
      const res = await fetch(target, { headers: { Accept: 'application/vnd.api+json' } });
      if (!res.ok) return;
      store(await res.json());
      annotate();
    } catch (e) {
      console.debug('[arena-skate-count] fetch failed', e);
    }
  }

  // ---------- page ----------

  const DATE_RE = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  const TIME_RE = /(\d{1,2}):(\d{2})\s*([ap])m\s*-\s*(\d{1,2}):(\d{2})\s*([ap])m/i;
  const toMin = (h, m, ap) => ((Number(h) % 12) + (ap.toLowerCase() === 'p' ? 12 : 0)) * 60 + Number(m);

  function findRecord(item) {
    const text = item.textContent.replace(/\s+/g, ' ');
    const d = text.match(DATE_RE);
    const t = text.match(TIME_RE);
    if (!d || !t) return null;

    const key = d[3] + '-' + d[1].padStart(2, '0') + '-' + d[2].padStart(2, '0') +
      '|' + toMin(t[1], t[2], t[3]) + '|' + toMin(t[4], t[5], t[6]);
    let list = [...(byKey.get(key) || new Map()).values()];
    if (list.length <= 1) return list[0] || null;

    // Several sessions share this slot: narrow by title, then by rink/area name.
    const titleEl = item.querySelector('dash-event-title');
    const title = (titleEl ? titleEl.textContent : '').trim();
    const narrow = (fn) => { const n = list.filter(fn); if (n.length) list = n; };
    if (title) narrow((r) => r.title === title);
    if (list.length > 1) narrow((r) => r.area && text.includes(r.area));
    if (list.length > 1) narrow((r) => r.resource && text.includes(r.resource));
    return list.length === 1 ? list[0] : null; // still ambiguous: show nothing rather than guess
  }

  function annotate() {
    for (const item of document.querySelectorAll('dash-list-group-item')) {
      const slot = item.querySelector(LABEL_SEL);
      if (!slot) continue;
      const mine = slot.querySelector('[' + MARK + ']');

      // If the page drew its own label, leave it alone.
      const native = [...slot.children].some((c) => !c.hasAttribute(MARK) && /registered/i.test(c.textContent));
      const rec = native ? null : findRecord(item);
      if (!rec) { if (mine) mine.remove(); continue; }

      const label = (rec.capacity > 0 ? rec.registered + '/' + rec.capacity : rec.registered) + ' Registered';
      const span = mine || document.createElement('span');
      if (!mine) {
        span.setAttribute(MARK, '');
        span.title = 'Added by Arena Skate Count: this session has no capacity set, so the page hides its count.';
        span.style.cssText = 'white-space:nowrap;border-bottom:1px dotted currentColor;cursor:help;';
        slot.appendChild(span);
      }
      if (span.textContent !== label) span.textContent = label;
    }
  }

  // ---------- wiring ----------

  // The page's own API calls show up in the resource timing list; repeat each one.
  const onEntries = (entries) => {
    for (const e of entries) if (API_RE.test(e.name)) refetch(e.name);
  };
  try {
    new PerformanceObserver((list) => onEntries(list.getEntries()))
      .observe({ type: 'resource', buffered: true });
  } catch (e) {
    onEntries(performance.getEntriesByType('resource'));
  }

  // Angular re-renders the list on every filter change, so re-apply labels.
  let timer = null;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(annotate, 150);
  }).observe(document.documentElement, { childList: true, subtree: true });

  annotate();
})();
