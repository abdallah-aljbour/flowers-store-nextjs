# Maskat Blooms — Storefront

The live, Arabic-first (RTL) online shop for **Maskat Blooms** bridal and occasion bouquets in Jordan, built with Next.js 14 and Firebase.

🌐 **Live:** [maskatblooms.com](https://maskatblooms.com)

---

## Design brief (for the storefront UI revamp)

| | |
|---|---|
| **Brand** | Maskat Blooms — bridal & occasion bouquets, Jordan |
| **Audience** | Brides and their families, mostly on mobile |
| **Language** | Arabic first, right-to-left (`<html lang="ar" dir="rtl">`) |
| **Main user flow** | Home (browse grid) → search / filter / sort → product page (image gallery) → add to wishlist or share → order via WhatsApp (pre-filled message) or Instagram |
| **Pages** | `/` home & catalog · `/product/[id]` product details · `/wishlist` saved products · `/about` story & partners (plus generated `/sitemap.xml` and `/robots.txt`) |
| **Current look** | Brand pink `pandora-pink` **#F593A2**, white `#FFFFFF`, black `#000000` (Tailwind config); neutral grays (`gray-50` backgrounds, `gray-600/900` text). Font: system **Arial / Helvetica** (set in `app/globals.css`; the Geist font files in `app/fonts/` are not used). Mobile-first 2-column product grid, rounded cards, bottom sheets and a slide-in drawer menu. |

**Keep:**

**Improve:**

---

## Where it fits in the system

Maskat Blooms is made of three repos that share one Firebase (e-commerce) project:

| Repo | Role |
|---|---|
| **flowers-store-nextjs** (this repo) | The live public storefront — maskatblooms.com |
| [Maskat-Blooms](https://github.com/abdallah-aljbour/Maskat-Blooms) *(private)* | Internal admin / back-office app. Adds and edits products and publishes them to the shop (`isPublished`) |
| [flowers-store](https://github.com/abdallah-aljbour/flowers-store) *(private, archived)* | Old Vite prototype of the storefront, replaced by this repo |

The storefront is **read-only**: it reads the `products` collection from Firestore and shows only products where `isPublished == true`, ordered by `order`. Products with `type: "bag"` are excluded.

## Features

- **Product catalog** from Firestore, 2-column mobile grid with pagination (20 per page)
- **Search** by product name
- **Filters** as chips: flower type, colors and price range (bottom sheet on mobile)
- **Sort:** default order, price low → high, price high → low
- **Product page** (`/product/[id]`) with an image gallery and dynamic SEO metadata
- **Wishlist** saved in `localStorage`, kept in sync across components
- **Order via WhatsApp** with a pre-filled message (product name, flower type, description, price), or open the shop's Instagram
- **Share** a product with the Web Share API (falls back to copying the link)
- **Burger menu** with a multi-level drawer
- **About page** with the brand story and a partners section
- **UX:** loading screen, product card skeletons, toast messages
- **Performance:** product list cached in `localStorage`, Next.js `<Image>` with AVIF/WebP, priority loading for the first images
- **SEO:** site metadata and OpenGraph image, per-product metadata, JSON-LD `Product` structured data, image alt text, `sitemap.js` (includes all published products), `robots.js`

## Tech stack

- **Next.js 14** (App Router) · **React 18** · JavaScript
- **Tailwind CSS 3**
- **Firebase Firestore** (Firebase JS SDK v12)
- lucide-react (icons) · react-hot-toast
- Deployed on **Vercel**

## Project structure

```
app/            # Routes: / , /product/[id], /wishlist, /about, sitemap.js, robots.js, layout & global CSS
components/     # UI: Header, SearchBar, FilterBar, FilterBottomSheet, ProductCard, ProductDetails, BurgerMenu, Footer…
hooks/          # useProducts (fetch, cache, search, filter, sort, paginate), useWishlist
services/       # productsService — Firestore queries
config/         # firebase.js — Firebase initialisation from env variables
contexts/       # ToastContext
public/         # Static assets (OpenGraph image)
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
