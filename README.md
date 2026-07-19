# Hekal — Online Store

A bilingual (Arabic/English) storefront for Hekal, the men's shirt maker in Imbaba,
Egypt (since 1970). Built with Next.js (App Router) + Tailwind CSS, backed by
Supabase for products, inventory and orders, deployed on Vercel.

## What's included

- **Storefront**: home, shop listing, product detail (size/color picker),
  cart, checkout, order confirmation, about, contact
- **Bilingual**: AR/EN toggle in the navbar, right-to-left layout flips
  automatically for Arabic
- **Cart**: persisted in the browser (localStorage)
- **Orders**: checkout writes to Supabase through a server-side API route
  (`/api/orders`) that calls an atomic Postgres function — it re-checks price
  and stock from the database (never trusts the browser), decrements
  inventory, and creates the order in one transaction
- **Cash on delivery** as the only payment method for now — the most common
  checkout method for small Egyptian retailers. Adding a payment gateway
  (Paymob, Fawry, or Stripe) later is a matter of adding a step before the
  `/api/orders` call; ask if you'd like this built out.

## 1. Open the project in VS Code

1. Unzip the project folder and open it in VS Code (`File > Open Folder`).
2. Install the **Node.js LTS** runtime if you don't have it: https://nodejs.org
   (VS Code's terminal will use whatever Node you have installed system-wide).
3. Open a terminal inside VS Code (`` Ctrl+` ``) and run:
   ```bash
   npm install
   ```

## 2. Set up Supabase

1. Create a free project at https://supabase.com.
2. Open **SQL Editor** in your Supabase project, paste the contents of
   `supabase/schema.sql`, and run it. This creates the tables, security
   policies, and the `create_order` function.
3. Optionally, run `supabase/seed.sql` the same way to load 4 sample products
   (Oxford, Poplin, Linen, Flannel shirts) so you have something to look at
   immediately. Replace these with your real catalog when ready — either by
   editing rows directly in **Table Editor**, or by asking me to build a
   simple admin page later.
4. Go to **Settings > API** in Supabase and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this one secret — never put it in the browser)

## 3. Add your environment variables

In VS Code, copy `.env.local.example` to a new file named `.env.local` and
fill in the three values from Supabase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`.env.local` is already in `.gitignore`, so it won't get committed.

## 4. Run it locally

```bash
npm run dev
```

Open http://localhost:3000 — you should see the Hekal storefront with the
sample products (if you ran the seed file).

## 5. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, click **Add New > Project**, and import the repo.
3. In the Vercel project's **Environment Variables** settings, add the same
   three variables from your `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**. Vercel will build and give you a live URL.

Every push to your main branch will automatically redeploy.

## Adding real products and photos

- Product photos: upload images to a Supabase **Storage** bucket (make it
  public), then paste the public URL into the `image_url` column for each
  product in Table Editor.
- Add new products/variants directly in Table Editor, following the shape in
  `supabase/seed.sql`.

## Project structure

```
app/                 Pages (App Router)
  page.tsx           Home
  products/           Shop listing + product detail
  cart/               Cart page
  checkout/           Checkout + success page
  about/  contact/    Static pages
  api/orders/         Server route that creates orders
components/          UI components (Navbar, Footer, ProductCard, ...)
context/             LanguageContext (AR/EN + RTL) and CartContext
lib/                 Supabase clients, types, i18n dictionaries
supabase/            schema.sql and seed.sql to run in Supabase's SQL editor
```

## What's deliberately left out of this first version

- **Payment gateway** — cash on delivery only, for simplicity and because
  it's the standard for small retailers in Egypt. Can be added later.
- **Admin dashboard** — for now, manage products/orders directly in
  Supabase's Table Editor. A simple custom admin page is a natural next step.
- **Localized URL routing** (`/en`, `/ar`) — the language toggle switches
  content client-side rather than through separate routes. This is simpler
  to ship but not ideal for SEO; worth revisiting once the store has content
  worth indexing in both languages.
