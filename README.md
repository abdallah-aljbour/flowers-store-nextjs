# Maskat Blooms — Storefront

The live, Arabic-first (RTL) online shop for **Maskat Blooms** bridal and occasion bouquets in Jordan, built with Next.js 14 and Firebase.

🌐 **Live:** [maskatblooms.com](https://maskatblooms.com)

---

## Design

The storefront uses the **Pearl Champagne** style: a warm pearl background (`#FFFDF9`), champagne surfaces and gold-tinted lines, ink-brown text, a rose accent for prices and active states, and a green used only for WhatsApp / order actions. The colours are Tailwind tokens in `tailwind.config.js` and were chosen for WCAG AA contrast.

- **Fonts** (via `next/font`, `app/fonts.js`): **Amiri** Bold for Arabic headings and product names, **IBM Plex Sans Arabic** for UI and body text, **Cormorant Garamond** for Latin text and numbers, plus a small self-hosted Amiri italic subset for the hero accent word.
- **Layout:** Arabic first, right-to-left, mobile first (390px) with 44px touch targets, scaling up to a desktop layout.
- **Motion:** CSS only (`app/motion.css`, no animation libraries); everything respects `prefers-reduced-motion`.
- **Design reference:** lives in Claude Design. The exported hand-off (`design-handoff/`) is local only and gitignored.

---

## Where it fits in the system

Maskat Blooms is made of three repos that share one Firebase (e-commerce) project:

| Repo | Role |
|---|---|
| **flowers-store-nextjs** (this repo) | The live public storefront — maskatblooms.com |
| [Maskat-Blooms](https://github.com/abdallah-aljbour/Maskat-Blooms) *(private)* | Internal admin / back-office app. Adds and edits products and publishes them to the shop (`isPublished`) |
| [flowers-store](https://github.com/abdallah-aljbour/flowers-store) *(private, archived)* | Old Vite prototype of the storefront, replaced by this repo |

The storefront is **read-only**: it reads the `products` collection from Firestore and shows only products where `isPublished == true`, ordered by `order`. Products with `type: "bag"` are excluded.

## Pages

| Route | Page |
|---|---|
| `/` | Home: hero, search, lookbook, wedding package story, photo strip, how to order |
| `/shop` | Full catalog with search, filters, sort and pagination |
| `/product/[id]` | Product details with image gallery, related products and order actions |
| `/wishlist` | Saved products, each with its own order button |
| `/about` | Brand story and partners section |

Plus the generated `/sitemap.xml` and `/robots.txt`.

## Features

- **Product catalog** from Firestore, 20 products per page (2-column grid on mobile)
- **Search** by product name
- **Filters:** flower type, colours and price range as chips (bottom sheet on mobile, sidebar on desktop), with removable active-filter chips
- **Sort:** default order, price low → high, price high → low
- **Shop view in the URL:** search, filters, sort and page are kept in the `/shop` query string, so sharing a link, reloading or going back restores the same view
- **Server-rendered first data:** Home, Shop and Product pages are rendered on the server with their first data and cached with ISR (`revalidate = 60`); the client refreshes from Firestore after load
- **Product page** with a swipe gallery on mobile, thumbnails on desktop, a sticky order bar, related products from the cached catalog, and dynamic SEO metadata
- **Wishlist** saved in `localStorage`, kept in sync across components
- **Order via WhatsApp** with a pre-filled message (product name, flower type, description, price), or open the shop's Instagram
- **Floating WhatsApp button** (mobile only) on Home and About. It is not shown on `/shop`, the product page or the wishlist, and it hides while any in-page WhatsApp button is on screen or while a menu drawer or bottom sheet is open
- **Share** a product with the Web Share API (falls back to copying the link)
- **Navigation:** new pages open at the top; going back restores Home and `/shop` where you left them; tap feedback while a product page opens
- **Burger menu** with a multi-level drawer
- **UX:** first-visit logo intro, photo placeholders, product card and product page skeletons, toast messages
- **Accessibility:** RTL, WCAG AA colours, 44px touch targets, focus-trapped dialogs, reduced-motion support (no intro, marquee, shimmer or smooth scrolling; page changes become a short fade)
- **Performance:** product list cached in `localStorage`, Next.js `<Image>` with AVIF/WebP and a preloaded hero image, Firebase SDK loaded lazily on the client (not in the first-load JS)
- **SEO:** site metadata and OpenGraph image, per-product metadata, JSON-LD `Product` structured data, image alt text, `sitemap.js` (includes all published products), `robots.js`

## Tech stack

- **Next.js 14** (App Router, ISR) · **React 18** · JavaScript
- **Tailwind CSS 3**
- **Firebase Firestore** (Firebase JS SDK v12)
- `next/font` (Google Fonts + one local subset) · lucide-react (icons)
- Deployed on **Vercel**

## Project structure

```
app/            # Routes: / , /shop, /product/[id] (+ loading), /wishlist, /about, sitemap.js, robots.js,
                # layout, template (page transitions), fonts.js, globals.css, motion.css
components/     # Page content (HomeContent, ShopContent, ProductPageContent, wishListContent, AboutPageContent),
                # Header, Footer, BurgerMenu, filters, ProductCard, ProductDetails, NavFeedback…
  home/         # Home sections: HomeIntro, Lookbook, PackageStory, PhotoStrip
  shop/         # ShopContent, FilterSidebar
  ui/           # Shared UI: Button, Chip, ProductImage, WhatsAppFab, Logo, icons…
hooks/          # useProducts (fetch, cache, search, filter, sort, paginate), useWishlist, useFocusTrap, useReveal
lib/            # Helpers: catalog view, lazy products client, contact links, WhatsApp message, navigation history…
services/       # productsService: Firestore queries
config/         # firebase.js: Firebase initialisation from env variables
contexts/       # ToastContext
public/         # Static assets (brand logos, OpenGraph image)
```

## Getting started

**Requirements:** Node.js 18+ and access to the Firebase project.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Name | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web config |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Shop WhatsApp number, international format without `+` |
| `NEXT_PUBLIC_INSTAGRAM_USERNAME` | Shop Instagram username |

See [`.env.example`](.env.example).

### Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## Deployment (Vercel)

1. Import the repo in Vercel (framework preset: **Next.js**, no extra config needed).
2. Add all the environment variables above under **Project → Settings → Environment Variables**.
3. Every push to `main` deploys to production. The custom domain `maskatblooms.com` is connected in Vercel.

## Screenshots

_Coming soon._
