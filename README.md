# TheStreetBrief — Site (Vercel + Beehiiv + Shopify Lite)

The static website for TheStreetBrief — five pages, a clean editorial design, a market ticker, and a built-in shop scaffold ready for Shopify Lite Buy Buttons.

## What's here

```
.
├── index.html         ← Home (hero + latest posts + market snapshot + CTA)
├── about.html
├── advertise.html
├── management.html
├── shop.html          ← Merch grid — six placeholder products
├── styles.css
├── forms.js           ← Handles newsletter + contact forms
├── site-config.js     ← Where you paste your Beehiiv URL (1 line)
├── tweaks-app.jsx     ← In-page tweaks UI (color + density)
├── tweaks-panel.jsx
└── assets/
    └── afb-logo.jpg
```

---

## Setup checklist

The whole stack:
- **Vercel** — hosts the site (free)
- **Beehiiv** — newsletter (free up to 2.5K subs)
- **Shopify Lite** — sells the merch ($5/mo)

### 1. Beehiiv (newsletter) — 5 min

1. Sign up at [beehiiv.com](https://beehiiv.com), create your publication.
2. Go to **Subscribe Forms → Create form → Embed → Custom HTML**.
3. Copy the form's `action` URL — it looks like `https://embeds.beehiiv.com/{form-id}/subscribe`.
4. Open **`site-config.js`** and paste it on this line:

   ```js
   BEEHIIV_FORM_URL: "https://embeds.beehiiv.com/{your-id}/subscribe",
   ```

Every newsletter form on every page now writes to Beehiiv. **Done.**

> Until you set this, signup forms still "work" — they show a fake success state so the design previews correctly.

### 2. Shopify Lite (merch) — 15 min

1. Sign up at [shopify.com](https://shopify.com) for **Shopify Lite** ($5/mo).
   *Note: Shopify Lite is a hidden plan — you may need to click through to "Sell on social media" first, then choose Lite. Or contact support to switch.*
2. **Products → Add product** for each piece of merch. Upload photos, set variants (sizes/colors), price, inventory.
3. **Sales channels → Buy Button**. Click a product → **Create Buy Button** → choose "Product" style → **Get embed code**.
4. Open `shop.html`, find the comment `<!-- SHOPIFY-LITE-BUY-BUTTON-1 -->` (and 2, 3, 4, 5, 6), paste the Shopify `<div>` + `<script>` right after each comment, and delete the line below it (`<button class="product-card__buy" type="button">Add to bag</button>` — that's the placeholder).
5. Update each product's title, price, and the `placeholder` letters in the gradient box to match.

That's it. Shopify handles cart, checkout, payments, shipping labels, taxes, inventory.

### 3. Vercel (hosting) — 2 min

#### Easiest path (no Git)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Choose **Other** → drag this folder onto the page.
3. Click **Deploy**. Your site is live at `something-something.vercel.app` in ~30 seconds.

#### Recommended path (Git, for easier edits)

1. Make a free GitHub repo, push these files.
2. Connect the repo at [vercel.com/new](https://vercel.com/new).
3. Now every git push auto-deploys.

### 4. Custom domain — 5 min

1. Buy `thestreetbrief.com` somewhere ([Namecheap](https://namecheap.com), [Porkbun](https://porkbun.com), [Cloudflare](https://cloudflare.com)).
2. In Vercel: **Project Settings → Domains → Add**, type `thestreetbrief.com`.
3. Vercel shows you DNS records to copy. Add them at your domain registrar.
4. 5–30 minutes later, the domain is live with free SSL.

---

## Editing the site

All copy lives directly in the HTML files. To change a headline, open the page and edit the text — that's it.

| To change…                           | Edit…                                       |
|--------------------------------------|---------------------------------------------|
| Beehiiv signup URL                   | `site-config.js`                            |
| Brand colors                         | `styles.css` (top of file — `:root`)        |
| Nav links                            | `<nav class="nav">` block, top of each page |
| Ticker symbols                       | `<div class="ticker">` block, near the top  |
| Home headline / latest posts         | `index.html`                                |
| Shop products                        | `shop.html`                                 |
| Footer links                         | `<footer class="site-footer">` (each page)  |

### Tweaks panel (developer aid)

Toggle the **Tweaks** button to live-edit the secondary accent color and section density. Changes persist via localStorage. Used for previewing — not surfaced to end users.

---

## Stack at a glance

```
[visitor]
   │
   ↓
[ thestreetbrief.com ]  ← Vercel (static HTML/CSS/JS)
   │
   ├── Newsletter signup forms  ──→  Beehiiv (collects emails, sends the brief)
   │
   └── Shop page → Buy Button   ──→  Shopify Lite (cart + checkout + fulfillment)
```

You never touch Vercel after deploy. You edit:
- **HTML files** for site copy/layout
- **`site-config.js`** for Beehiiv
- **Shopify admin** for products + orders
- **Beehiiv** for writing the newsletter

---

## Troubleshooting

**Newsletter form doesn't submit to Beehiiv** → Open `site-config.js` and check `BEEHIIV_FORM_URL` is the full `https://embeds.beehiiv.com/…/subscribe` URL, not just an ID.

**Shopify Buy Button looks wrong** → After pasting the embed, the button may inherit Shopify's default style for a second on first load. That's normal. If you want to force the brand look long-term, the `styles.css` file has a `.shopify-buy__btn` override that catches most cases.

**Ticker is overlapping the header** → That means the sticky header CSS isn't loading. Hard-refresh (Cmd/Ctrl + Shift + R).

**Adding more products** → Duplicate one `<article class="product-card">` block in `shop.html`, paste in a new Shopify Lite Buy Button, update the title/price/placeholder.

---

## When to upgrade

- **Shopify Lite → Shopify Basic ($39/mo)** — when you have 10+ products and want a real storefront with collections, search, etc. The shop becomes `shop.thestreetbrief.com` and uses the theme in `_archive/` or the original `shopify-theme/` folder we built earlier.
- **Beehiiv free → Scale ($42/mo)** — when you hit 2,500 subscribers, or want the Boost network / premium features.
- **Vercel free → Pro ($20/mo)** — almost certainly not needed for a marketing site.

Built for @afinancebro / TheStreetBrief.
