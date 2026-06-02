// site-config.js
// One-time configuration for TheStreetBrief.
// Edit the values below — every page on the site reads from this file.

window.TSB_CONFIG = {

  // ---------- Beehiiv (newsletter) ----------
  // 1. Sign up at https://beehiiv.com and create your publication.
  // 2. Go to Subscribe Forms → create a form → Embed → Custom HTML.
  // 3. Copy the form's action URL (looks like https://embeds.beehiiv.com/<id>/subscribe)
  //    and paste it below.
  //
  // While this is empty, signup forms still "work" — they just show a fake
  // success state so the design previews correctly.
  BEEHIIV_FORM_URL: "",

  // Success message shown after a successful signup.
  NEWSLETTER_SUCCESS: "✓ You're in. First issue lands Sunday morning.",

  // ---------- Shopify Lite (merch) ----------
  // After you sign up for Shopify Lite ($5/mo):
  //   1. Add your products in Shopify admin.
  //   2. Go to each product → Buttons → Create Buy Button → Embed code.
  //   3. Paste each Buy Button's <div> + <script> into shop.html where
  //      indicated (look for `<!-- SHOPIFY-LITE-BUY-BUTTON-N -->` comments).
  //
  // No values needed here yet — Shopify Lite gives you copy-paste embed code.

  // ---------- Live market prices ----------
  // Handled server-side by /api/quotes.js (Vercel function) so your API key
  // stays private and traffic doesn't burn the free tier. Nothing to set here.
  // The key lives in Vercel → Settings → Environment Variables (TWELVE_DATA_KEY),
  // with a fallback inside api/quotes.js.

};
