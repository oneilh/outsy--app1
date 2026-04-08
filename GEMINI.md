# GEMINI.md — Outsy

> **AI IDE Rules File** · project: Outsy · version: 1.0 · scope: MVP
>
> _Open the app, pick a spot, go out — in under 60 seconds._

---

## 01 · Product Overview

Outsy helps people decide where to go out — fast. Instead of scrolling Instagram, TikTok, Google Maps, and WhatsApp for hours, users open Outsy and get clear, curated outing ideas with the vibe, price, and location already sorted.

Covers individuals, couples, friends, and groups. Includes restaurants, hotels, activities, events, parks, cafes, bars, hidden gems, and more.

---

## 02 · Core Tech Stack (Non-Negotiable)

| Layer | Tool | Notes |
|---|---|---|
| Framework | `Next.js 15+` (App Router) | Server components by default; client only when needed |
| Styling | `Tailwind CSS v4` | See Section 04 for v4-specific rules |
| UI Components | `shadcn/ui` | Init before first component task |
| Database (live) | `Supabase` | Not wired up yet at MVP start |
| Database (mock) | JSON flat files in `/data/*.json` | Used until Supabase is connected |
| Icons | `react-icons` | See Section 05 for icon set rules |
| Hooks | `reacthaiku` | Use before writing custom hooks |
| Carousel | `@splidejs/react-splide` | Install if not present |
| Backend | Next.js API routes / Server Actions | No separate backend server |
| Hosting | `Vercel` | Free tier, fast deploys |
| Saves | Browser `localStorage` | No backend needed |
| Email | `Resend` | Send saved lists without a server |
| Analytics | `PostHog` or `Umami` | Set up PostHog from day one — track the Golden Sequence |

> **PostHog note:** Set up PostHog from day one — not just for pageviews, but to track the Golden Sequence. This will be your most important product signal in the first 3 months.

---

## 03 · Skills — Always Check Before Starting a Task

Before any task, check which skills apply and summarise them to the user for approval before executing.

| Skill | When to Use |
|---|---|
| `Vercel / Next.js` | Any routing, deployment config, API route, or Next.js-specific pattern |
| `frontend-design` | Any new page or major component — guides aesthetic decisions |
| `reacthaiku` | Before writing any custom hook — check the library first |

> **Rule:** Never silently apply a skill. Always tell the user: _"I'm going to use [skill name] which does [one-line summary]. Shall I proceed?"_

---

## 04 · Tailwind CSS v4 Rules

> ⚠️ **Breaking change from v3:** Tailwind v4 has no `tailwind.config.js` by default. Do not generate one unless explicitly asked.

| Rule | Detail |
|---|---|
| Design tokens | Define in `globals.css` using `@theme { }` block |
| Theme values | Use CSS custom properties: `--color-*`, `--font-*` |
| No `theme()` in CSS | Use `var(--...)` instead |
| No `content` array | v4 auto-detects — do not add config |
| One-off colors | Arbitrary values like `bg-[#hex]` are fine |
| Layout | Always use `flex`, `grid`, `grid-cols-*` utilities — no `float` or positional hacks |

---

## 05 · Icons — react-icons Rules

| Set | Prefix | Usage |
|---|---|---|
| Remix Icons _(primary)_ | `ri` | All UI actions, navigation, and general icons |
| Lucide _(secondary)_ | `lu` | Only when a Remix icon doesn't exist for the concept |

- Never mix more than two icon sets on one screen.
- Never use emojis as UI elements — replace all PRD emojis with react-icons equivalents.
- Always import named icons: `import { RiMapPinLine } from "react-icons/ri"`

---

## 06 · Images

| Rule | Detail |
|---|---|
| Component | Always use `next/image` |
| Mock phase source | Unsplash via URL — match Lagos / Nigerian food, nightlife, outdoor, activity contexts |
| Custom images | Describe subject, mood, aspect ratio — user provides to `/public/images/[screen-name]/` |
| Placeholders | Never use `placeholder.com` or grey boxes — always find a contextually relevant image |
| Alt text | Required on every image |

---

## 07 · Data — Mock JSON Rules

| File | Contents |
|---|---|
| `/data/spots.json` | Spot listings |
| `/data/collections.json` | Curated collections |
| `/data/events.json` | Events |
| `/data/picks.json` | Outsy Picks |

- JSON field shapes must match the Supabase schema that will replace them — design fields as if they are DB columns.
- Access mock data via a server component or a `/lib/data.ts` helper — never import JSON directly in a client component.
- When Supabase is connected, only the `/lib/data.ts` layer changes — components stay the same.

---

## 08 · Component Rules

| Rule | Detail |
|---|---|
| Server first | Add `"use client"` only when the component needs browser APIs, state, or event handlers |
| Primitives | Use `shadcn/ui` (Button, Card, Sheet, Dialog, Tabs, Badge) before building from scratch |
| Responsibility | One clear responsibility per component file — no god components |
| Props | Must be typed with TypeScript interfaces. No `any` |
| Component path | `/components/[feature]/ComponentName.tsx` |
| Page path | `/app/[route]/page.tsx` |

---

## 09 · Responsiveness — Three Breakpoints

Every screen must work at three breakpoints:

| Breakpoint | Tailwind prefix | Target |
|---|---|---|
| Mobile | _(default, no prefix)_ | 375px – 767px |
| Tablet | `md:` | 768px – 1023px |
| Desktop | `lg:` | 1024px+ |

> **Mobile-first:** Base styles are mobile. Layer up with `md:` and `lg:`. Test the layout mentally at all three sizes before finishing.

---

## 10 · UI/UX Principles

| Principle | Application |
|---|---|
| Hick's Law | Never show more than 3–4 filter options at once. Fewer choices = faster decisions |
| 3-Click Rule | User must reach a recommendation in max 3 taps from the home screen |
| Progressive Disclosure | Show the 3 best results first. "Show More" reveals the rest |
| Affordance | Every tappable element must look tappable. Use visual weight, not just underlines |
| Empty State Prevention | Never render a blank screen. Always show a skeleton, fallback, or default content |
| Feedback | Every action (save, going now, compare) needs immediate visual feedback |
| Content over Chrome | Minimal nav, maximum content. Don't waste mobile screen space on headers |

---

## 11 · Carousel Rule

Use `@splidejs/react-splide` for all carousels (Outsy Picks, Trending, Collections).

```bash
npm install @splidejs/react-splide
```

```ts
import '@splidejs/react-splide/css'
```

Always configure for mobile swipe with `perPage` responsive options.

---

## 12 · Hooks Rule

> **Rule:** Before writing any custom hook, check [reacthaiku.dev](https://www.reacthaiku.dev/) for an existing one. Only write a custom hook if reacthaiku doesn't have it AND the logic is reused in 2+ places.

Custom hooks live in `/hooks/useHookName.ts`

---

## 13 · Chunk Size & Continuity Rule

Work in small, completable chunks — one screen or one major component per task. At the end of every task, output a "Continue from here" block:

```
## Continue From Here (paste into new chat)
- Project: Outsy
- Rules file: GEMINI.md (at project root)
- Last completed: [screen/component name]
- Next task: [screen/component name]
- Pending decisions: [any open questions]
- Mock data status: [what exists, what's missing]
```

---

## 14 · What NOT to Do

- ❌ Do not build user auth or accounts — not in scope for MVP.
- ❌ Do not wire up Supabase until explicitly told to.
- ❌ Do not build more than one screen per task.
- ❌ Do not use emojis in UI — use react-icons.
- ❌ Do not use Tailwind v3 patterns (`tailwind.config.js`, `theme()` in CSS).
- ❌ Do not create custom hooks if reacthaiku has one.
- ❌ Do not install packages without telling the user first.
- ❌ Do not apply skills silently — always summarise and get approval.
- ❌ Do not use `any` in TypeScript.
- ❌ Do not use `float` for layout.