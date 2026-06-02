// ticker.js
// Fills the top ticker (every page) and the Market Snapshot table (home) with
// live-ish market data from our own cached endpoint: /api/quotes
//
// Why /api/quotes and not Twelve Data directly?
//  - The API key stays server-side (not exposed in the page).
//  - Vercel caches the response (~15 min), so all visitors share ONE upstream
//    fetch instead of each browser burning free-tier credits.
//
// Graceful by design: if /api/quotes isn't available (e.g. opening the raw
// HTML locally without the Vercel function), nothing changes — the hardcoded
// placeholder numbers in the HTML stay, so the design never looks broken.
// Any symbol the endpoint doesn't return also keeps its placeholder.

(function () {
  'use strict';

  // Twelve Data symbol (returned by /api/quotes) → labels used in the HTML.
  // Ticker labels come from .ticker__sym; snapshot labels from .snapshot-row__sym.
  var TICKER_BY_TD = {
    'GSPC': 'SPX',
    'IXIC': 'NDX',
    'DJI':  'DJI',
    'RUT':  'RUT',
    'BTC/USD':  'BTC',
    'XAU/USD':  'GOLD',
    'WTI/USD':  'WTI'
  };
  var SNAP_BY_TD = {
    'GSPC': '^GSPC',
    'DJI':  '^DJI',
    'IXIC': '^IXIC',
    'RUT':  '^RUT',
    'FTSE': '^FTSE',
    'BTC/USD':  'BTC-USD',
    'XAU/USD':  'GC',
    'WTI/USD':  'CL'
  };

  function fmtPrice(td, raw) {
    var v = parseFloat(raw);
    if (isNaN(v)) return null;
    if (td === 'EUR/USD') return v.toFixed(4);
    if (v >= 1000) return v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function pctStr(p) {
    var n = parseFloat(p);
    if (isNaN(n)) return null;
    return Math.abs(n).toFixed(2) + '%';
  }

  function updateTicker(quotes) {
    var byLabel = {};
    Object.keys(TICKER_BY_TD).forEach(function (td) {
      if (quotes[td]) byLabel[TICKER_BY_TD[td]] = { q: quotes[td], td: td };
    });
    document.querySelectorAll('.ticker__item').forEach(function (item) {
      var symEl = item.querySelector('.ticker__sym');
      if (!symEl) return;
      var hit = byLabel[symEl.textContent.trim()];
      if (!hit) return;
      var priceEl = item.children[1], chgEl = item.children[2];
      var price = fmtPrice(hit.td, hit.q.price), pct = pctStr(hit.q.pct);
      if (price && priceEl) priceEl.textContent = price;
      if (pct && chgEl) {
        var up = parseFloat(hit.q.pct) >= 0;
        chgEl.className = up ? 'ticker__up' : 'ticker__down';
        chgEl.innerHTML = '<span class="ticker__arrow">' + (up ? '▲' : '▼') + '</span> ' + pct;
      }
    });
  }

  function updateSnapshot(quotes) {
    var byLabel = {};
    Object.keys(SNAP_BY_TD).forEach(function (td) {
      if (quotes[td]) byLabel[SNAP_BY_TD[td]] = { q: quotes[td], td: td };
    });
    document.querySelectorAll('.snapshot-row').forEach(function (row) {
      var symEl = row.querySelector('.snapshot-row__sym');
      if (!symEl) return;
      var hit = byLabel[symEl.textContent.trim()];
      if (!hit) return;
      var valEl = row.querySelector('.snapshot-row__val'), chgEl = row.querySelector('.snapshot-row__chg');
      var price = fmtPrice(hit.td, hit.q.price), pct = pctStr(hit.q.pct);
      if (price && valEl) valEl.textContent = price;
      if (pct && chgEl) {
        var up = parseFloat(hit.q.pct) >= 0;
        chgEl.className = 'snapshot-row__chg ' + (up ? 'snapshot-row__chg--up' : 'snapshot-row__chg--down');
        chgEl.textContent = (up ? '▲' : '▼') + ' ' + pct;
      }
    });
  }

  function refresh() {
    fetch('/api/quotes')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.quotes) return;
        updateTicker(data.quotes);
        updateSnapshot(data.quotes);
      })
      .catch(function () { /* keep placeholders */ });
  }

  refresh();
  // Re-read the (cached) endpoint every 5 min so a long-open tab stays current.
  // This is cheap: the CDN serves the cached copy; upstream is hit ~once/15min.
  setInterval(refresh, 5 * 60 * 1000);
})();
