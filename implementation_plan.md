# Outsy MVP — Task 1: Foundation

> **Scope**: Design system, layout, navigation, mock data, TypeScript types, data helpers, routing skeleton.
> This is the **foundation layer** — no feature screens are built here.

---

## User Review Required

> [!IMPORTANT]
> **Font choice**: I'm going with **Outfit** from Google Fonts — modern, friendly, and fits the vibe. Replacing Geist entirely.

> [!IMPORTANT]
> **Light mode default** as requested. Dark mode support is included via `data-theme="dark"` attribute but defaults to light.

> [!IMPORTANT]
> **shadcn/ui init**: This will create `components.json`, `/components/ui/`, and `/lib/utils.ts`. I'll configure it for Tailwind v4 (CSS variables, no `tailwind.config.js`).

> [!IMPORTANT]
> **Packages to install**:
> - `react-icons` — icon library (Remix Icons primary, Lucide secondary)
> - `@splidejs/react-splide` — carousel component
> - `react-haiku` — hook library (46 hooks, <7KB)
> - shadcn/ui via `npx shadcn@latest init`

---

## Proposed Changes

### Package Installations

Install required dependencies per GEMINI.md:
```bash
npm install react-icons @splidejs/react-splide react-haiku
npx shadcn@latest init
```

---

### Design System — globals.css

#### [MODIFY] [globals.css](file:///c:/Users/O'Neil/Desktop/outsy--app1/app/globals.css)

Complete rewrite with Outsy brand palette from `outsy-brand-colors.md`:

- **`:root`** — Light mode tokens (Primary `#E8573A`, Secondary `#1B2A4A`, Accent `#F9A825`, Background `#FDFBF9`, Surface `#FFF5F0`, etc.)
- **`[data-theme="dark"]`** — Dark mode tokens (Primary `#F06B50`, Background `#0F1623`, etc.)
- **`@theme inline`** — Register all tokens as Tailwind v4 theme values so they work as `bg-primary`, `text-secondary`, etc.
- **Typography** — Base styles using Outfit font
- **Utility classes** — Reusable `.chip`, `.badge`, `.card-surface` classes
- **Transitions** — Smooth color transitions for theme switching
- **Scrollbar** — Custom styled scrollbar matching brand

---

### TypeScript Types

#### [NEW] [types.ts](file:///c:/Users/O'Neil/Desktop/outsy--app1/lib/types.ts)

All data shape interfaces matching future Supabase schema:

```typescript
interface Spot {
  id: string;
  name: string;
  slug: string;
  description: string;
  area: string;
  city: string;
  category: SpotCategory;
  budgetTier: BudgetTier;
  priceRange: string;
  vibeTags: string[];
  whoItsFor: string[];
  amenities: string[];
  bestTimeToGo: string;
  images: string[];
  phone: string;
  instagram: string;
  website: string;
  mapsUrl: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  isFeatured: boolean;
  isOutsyPick: boolean;
  isNew: boolean;
  goingNowCount: number;
  type: 'spot' | 'event';
  eventDate?: string;
  eventEndDate?: string;
  createdAt: string;
}

type SpotCategory = 'eating' | 'drinking' | 'outdoors' | 'activities' | 'nightlife' | 'cafe' | 'hotel' | 'event';
type BudgetTier = 'budget' | 'mid' | 'splurge';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  type: 'category' | 'mood' | 'who' | 'curated';
  spotIds: string[];
}

interface OutsyPick {
  id: string;
  spotId: string;
  weekStartDate: string;
  order: number;
}
```

---

### Mock Data Files

#### [NEW] [spots.json](file:///c:/Users/O'Neil/Desktop/outsy--app1/data/spots.json)

~25 realistic Lagos spots across all categories:
- **Eating**: Nok by Alara (Lekki), Shiro Lagos (VI), Bungalow Restaurant (Ikoyi), Mama Puteria (Yaba), Sky Restaurant (VI)
- **Drinking**: Mood Bar & Bistro (Lekki), Hard Rock Cafe (VI), Sailors Lounge (Lekki)
- **Nightlife**: Quilox (VI), Club 57 (Ikoyi)
- **Outdoors**: Lekki Conservation Centre, Nike Art Gallery (Lekki), Tarkwa Bay Beach
- **Activities**: UPBEAT Recreation (Lekki), Wake Park Lagos (Lekki)
- **Cafes**: Bogobiri House (Ikoyi), The Rustic Table (Victoria Island)
- **Hotels**: The George (Ikoyi), Eko Hotel (VI)

Each spot has realistic fields: multiple Unsplash images (contextual — Nigerian food, nightlife, outdoor), vibe tags, price ranges in ₦, areas, amenities, etc.

#### [NEW] [collections.json](file:///c:/Users/O'Neil/Desktop/outsy--app1/data/collections.json)

12 collections:
- **Category**: Eating, Drinking, Outdoors, Activities
- **Mood/Vibe**: Chill Spots, Party Mode, Date Night
- **Who**: With Friends, Couples, Solo Trip
- **Curated**: Hidden Gems, Just Added, This Weekend's Events

#### [NEW] [events.json](file:///c:/Users/O'Neil/Desktop/outsy--app1/data/events.json)

5 sample events (these are spot entries with `type: 'event'`)

#### [NEW] [picks.json](file:///c:/Users/O'Neil/Desktop/outsy--app1/data/picks.json)

5 Outsy Picks for the current week

---

### Data Layer

#### [NEW] [data.ts](file:///c:/Users/O'Neil/Desktop/outsy--app1/lib/data.ts)

Server-side data helper — the **only** place that imports JSON files:

```typescript
// Functions:
getAllSpots()
getSpotById(id: string)
getSpotBySlug(slug: string)
getSpotsByCategory(category: SpotCategory)
getSpotsByBudget(budget: BudgetTier)
getTrendingSpots(limit?: number)
getOutsyPicks()
getAllCollections()
getCollectionBySlug(slug: string)
getSpotsForCollection(collectionSlug: string)
getFilteredSpots(filters: FilterOptions)
getRandomSpot()
searchSpots(query: string)
```

When Supabase replaces JSON, only this file changes — components stay untouched.

---

### Root Layout & Navigation

#### [MODIFY] [layout.tsx](file:///c:/Users/O'Neil/Desktop/outsy--app1/app/layout.tsx)

- Replace Geist fonts with **Outfit** from `next/font/google`
- Update metadata: `title: "Outsy — Open it. Pick a spot. Go out."`, proper description
- Add `<Navigation />` component
- Light theme by default
- Proper viewport + SEO meta tags

#### [NEW] [Navigation.tsx](file:///c:/Users/O'Neil/Desktop/outsy--app1/components/navigation/Navigation.tsx)

Responsive navigation per site structure:

| Breakpoint | Pattern |
|---|---|
| Mobile (<768px) | Bottom bar — icon + label, fixed to bottom |
| Tablet/Desktop (768px+) | Top navbar — horizontal links, logo left |

Nav items:
- Home (`/`) — `RiHome5Line` / `RiHome5Fill`
- Collections (`/collections`) — `RiGridLine` / `RiGridFill`
- Saved (`/saved`) — `RiBookmarkLine` / `RiBookmarkFill`
- About (`/about`) — `RiInformationLine` / `RiInformationFill`

Active state uses primary color (`#E8573A`), with smooth transitions.

---

### Next.js Configuration

#### [MODIFY] [next.config.ts](file:///c:/Users/O'Neil/Desktop/outsy--app1/next.config.ts)

Add `images.remotePatterns` for Unsplash:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
}
```

---

### Route Skeleton (empty pages)

#### [MODIFY] [page.tsx](file:///c:/Users/O'Neil/Desktop/outsy--app1/app/page.tsx)

Replace Next.js boilerplate with a minimal Outsy home placeholder (will be built in Task 2).

#### [NEW] Route directories (placeholder `page.tsx` files):
- `/app/spots/[id]/page.tsx`
- `/app/saved/page.tsx`
- `/app/compare/page.tsx`
- `/app/collections/page.tsx`
- `/app/collections/[slug]/page.tsx`
- `/app/about/page.tsx`

Each is a minimal server component with the page title — enough to verify navigation works.

---

## Open Questions

None — all decisions have been confirmed by the user.

## Verification Plan

### Automated Tests
1. Run `npm run build` — ensure zero TypeScript/build errors
2. Run `npm run dev` — verify the app starts without errors
3. Browser test: navigate all routes, verify navigation highlights work at mobile + desktop breakpoints

### Manual Verification
- Visually verify brand colors render correctly
- Confirm Outfit font loads
- Confirm navigation switches between bottom bar (mobile) and top nav (desktop)
- Confirm all routes are reachable
