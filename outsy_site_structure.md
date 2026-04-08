# Outsy MVP — Page & Route Structure
**Version:** 1.0 · **Market:** Lagos-first · **Scope:** MVP

---

## Navigation

Navigation adapts across breakpoints — same items everywhere, different layout:

| Breakpoint | Pattern |
|---|---|
| Mobile (< 768px) | Bottom bar — icon + label |
| Tablet (768px–1023px) | Top navbar — horizontal links |
| Desktop (1024px+) | Top navbar — horizontal links |

**Nav items:**

| Label | Route | Notes |
|---|---|---|
| Home | `/` | Default landing page |
| Collections | `/collections` | Full collections browse — Home only shows a strip |
| Saved | `/saved` | Bookmarked spots via localStorage |
| About | `/about` | How Outsy works |

> Filter is not a nav item — it is triggered by a button on the Home screen and opens as a sheet overlay.

---

## End User App

| Route | Page / Component | Key behaviour |
|---|---|---|
| `/` | Home | Trending This Week, Outsy Picks carousel, Collections horizontal strip (with "See all" → `/collections`), Random button |
| `/spots/[id]` | Spot detail | Photos, description, budget tier, vibe tags, amenities, best time, verified badge, last verified date — actions: Call, Maps, Instagram, Share, Going Now, Save, Compare, Report an Issue |
| `/saved` | Saved | Spots saved to localStorage, share list, email list via Resend |
| `/compare` | Compare | 2–3 spots side by side |
| `/collections` | Collections browse | Collection cards only — not a full spot list |
| `/collections/[slug]` | Collection detail | 3 spots shown initially, "Show more" reveals the rest |
| `/about` | How it works | Static page explaining Outsy — in nav |

### Overlays (no dedicated route)

| Overlay | Trigger | Behaviour |
|---|---|---|
| Filter sheet | Filter button on Home | Min 1 filter required, rest optional — Activity, Going with, Feeling, Budget |
| Filter results | Applying filter | Up to 3 spot cards, Shuffle, Pick for me |

---

## Admin Dashboard
> All `/admin/*` routes are protected. Access requires a magic link sent to a pre-approved email address.

| Route | Page / Component | Key behaviour |
|---|---|---|
| `/admin/login` | Login | Email input → magic link sent via Resend |
| `/admin` | Admin home | Overview and navigation to all sub-sections |
| `/admin/spots` | Spot management | List all spots, add and edit via modal overlay, archive |
| `/admin/verify` | Verification queue | Three tiers: Urgent (30+ days), Due (14–29 days), Pending (7–13 days) — user-submitted reports appear here tagged "User Report" |
| `/admin/business` | Business & payments | Manual tracking table — name, tier, start date, expiry, status, contact, notes |
| `/admin/calendar` | Content calendar | Weekly view — Outsy Picks, active Rotator Spots, Featured businesses, upcoming expiries |

### Admin overlay (no dedicated route)

| Overlay | Trigger | Behaviour |
|---|---|---|
| Add / edit spot modal | Add or edit button on `/admin/spots` | Full spot form — all fields |

---

## Data & Component Rules

| Rule | Detail |
|---|---|
| Events | A `type` field on a spot — not a separate page, route, or feature |
| Collections on Home | Horizontal scroll strip only — "See all" links to `/collections` |
| Filter | Sheet overlay triggered from Home — min 1 option, not a page |
| Saves | Persisted in `localStorage` — no backend or account needed |
| Report an Issue | User-submitted from `/spots/[id]` — feeds into `/admin/verify` tagged "User Report" |
| About | In main navigation — not footer-only |
| Admin auth | Magic link via Resend — no password, no user account system |
| Supabase | Not wired at MVP — all data served from `/data/*.json` via `/lib/data.ts` |
