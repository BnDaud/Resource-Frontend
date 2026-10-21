# Resources Components: website and CMS

One React app (Vite, TypeScript, Tailwind CSS):

- **Customer website** at `/`: home, catalogue split into Boards and Accessories (search, filters, sorting, pagination), product pages, quote list and form, contact, track a request.
- **Staff CMS** at `/admin` (a small "Staff login" link in the footer). It is lazy-loaded, so customers never download it.

It needs the API from the backend repo. In development Vite proxies `/api` and `/sitemap.xml` to `http://127.0.0.1:8000`, so cookies stay same-origin.

```
src/
  api/        fetch client + types
  components/ shared UI (ui/), PasswordInput, TagInput, ContactButtons
  lib/        hooks (useFetch, useDebounced, ...), status labels, formatting
  site/       the customer website: pages/, components/, context/ (settings, quote list), lib/
  admin/      the CMS, one folder per screen
  test/       shared test helpers
```

## Run

Node 20+.

```bash
npm install
npm run dev      # http://localhost:5173 (start the backend on :8000 first)
npm test         # vitest + Testing Library
npm run build    # production build in dist/
```

In production, serve `dist/` with a single-page-app fallback to `index.html`, and proxy `/api` and `/sitemap.xml` to the backend on the same domain (this avoids cross-domain cookie problems). Set the full website URL in the `Sitemap:` line of `public/robots.txt`. If the API is on another origin, set `VITE_API_URL` and list the website in the backend's `FRONTEND_ORIGIN`.

## Notes

- **Sizing:** the UI is sized in `rem`; one rule in `src/index.css` renders it at 90% from tablet width up and 100% on phones.
- **Palette:** navy, ink, ice and brass (see `tailwind.config.js`).
- **No customer accounts.** Customers keep references from their quote/enquiry; the quote list and recent references live in the browser's localStorage.
- **WhatsApp:** buttons open `wa.me` chats using the number set in CMS Settings, and are hidden when none is set.
- **SEO:** titles, descriptions, Open Graph tags and product structured data are set in the browser; server-side rendering would be needed for rich link previews of individual products.
- Photos in `public/site/` and the demo product photos are Unsplash stand-ins (free licence). Replace them with your own.
