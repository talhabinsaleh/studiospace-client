# StudioSpace

A peer-to-peer marketplace where creators find and book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour, and studio owners earn from their empty hours.

**Live site:** https://studiospace-talha.vercel.app

**Server repository:** https://github.com/talhabinsaleh/studiospace-server

## Examiner test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator (has bookings for every status) | `creator@studiospace.demo` | `Reel-Creator-4827` |
| Host (has listings and booking requests) | `host@studiospace.demo` | `Reel-Host-6193` |

The login page also has buttons that fill in these accounts.

## Features

- **Discover studios:** search and filter by category, rate, rating and group size, with sorting and pagination
- **Live availability:** the booking window marks confirmed hours and shows the full price with deposit
- **Double-booking prevention:** the server rejects any time that overlaps a confirmed booking, with a clear message
- **Host dashboard:** hosts confirm, decline and complete booking requests, and see their earnings
- **Secure sessions:** BetterAuth with email and Google login, plus a JWT in an HTTPOnly cookie that protects server changes
- **Studio management:** add, update and delete listings, with imgbb image upload and a confirmation before deleting
- **Light and dark themes:** the whole site switches, and your choice is remembered
- **PDF invoices and saved studios:** download a receipt for confirmed bookings, and save favourites with the heart icon

## Tech stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, DaisyUI 5, Swiper, Sonner, jsPDF
- **Authentication:** BetterAuth, MongoDB adapter, JWT (jose)
- **Backend:** Express 5, MongoDB, TypeScript

## Local setup

Start [the server](https://github.com/talhabinsaleh/studiospace-server) first, then:

```bash
git clone https://github.com/talhabinsaleh/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```

`JWT_SECRET` must be the same value on the client and the server. Google login needs `http://localhost:3000/api/auth/callback/google` added as a redirect URI in Google Cloud.

## How the login cookie works

After BetterAuth confirms a session, `/api/session-token` signs a JWT and stores it in an HTTPOnly cookie. Browser requests to `/api/*` pass through a Next.js rewrite to Express, so the cookie stays first-party and is not blocked as a third-party cookie.
