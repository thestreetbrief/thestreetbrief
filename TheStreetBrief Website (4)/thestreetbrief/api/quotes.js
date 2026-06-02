// api/quotes.js — Vercel serverless function
//
// Fetches market quotes from Twelve Data ONCE and caches the response on
// Vercel's CDN, so every visitor reads the same cached data instead of each
// browser calling Twelve Data directly. This keeps usage within the free tier
// (8 credits/min, 800/day) no matter how much traffic the site gets, and keeps
// your API key OFF the public page (it lives in a server-side env var).
//
// ── Setup ──────────────────────────────────────────────────────────────
// In Vercel: Project → Settings → Environment Variables → add
//     TWELVE_DATA_KEY = your key
// (A hardcoded fallback is included so it still works if you skip that, but
//  using the env var keeps the key fully private.)
//
// The CDN cache (s-maxage below) means Twelve Data is hit at most once per
// cache window across ALL visitors. 8 symbols × ~96 windows/day ≈ 768 credits,
// just under the 800/day free limit.

const TWELVE_DATA_KEY =
  process.env.TWELVE_DATA_KEY || "7831feee68774dd1a7d239a9336e474f";

// 8 symbols max on the free tier (8 credits/min). These cover the snapshot
// table (true index levels) and the ticker reuses them where they overlap.
const SYMBOLS = [
  "GSPC",      // S&P 500
  "DJI",       // Dow Jones
  "IXIC",      // Nasdaq Composite
  "RUT",       // Russell 2000
  "FTSE",      // FTSE 100
  "BTC/USD",   // Bitcoin
  "XAU/USD",   // Gold
  "WTI/USD"    // Crude oil
];

export default async function handler(req, res) {
  try {
    const url =
      "https://api.twelvedata.com/quote?symbol=" +
      encodeURIComponent(SYMBOLS.join(",")) +
      "&apikey=" +
      encodeURIComponent(TWELVE_DATA_KEY);

    const r = await fetch(url);
    const data = await r.json();

    // Normalize into { SYMBOL: { price, pct } }, skipping anything that errored.
    const out = {};
    for (const sym of SYMBOLS) {
      const e = SYMBOLS.length === 1 ? data : data[sym];
      if (e && e.close !== undefined && e.status !== "error" && !e.code) {
        out[sym] = {
          price: e.close,
          pct: e.percent_change
        };
      }
    }

    // Cache on Vercel's CDN for 15 minutes; serve stale up to 1h while
    // revalidating. One upstream fetch per window, shared by all visitors.
    res.setHeader(
      "Cache-Control",
      "s-maxage=900, stale-while-revalidate=3600"
    );
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ updated: Date.now(), quotes: out });
  } catch (err) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json({ updated: Date.now(), quotes: {}, error: true });
  }
}
