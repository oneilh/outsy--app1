# Outsy — Product Requirements Document
**Version:** 1.0 (MVP)
**Market:** Nigeria — Lagos-first, built to scale
**Last Updated:** April 2026

---

## What Is Outsy?

Outsy helps people decide where to go out — fast. Instead of scrolling Instagram, TikTok, Google Maps, and WhatsApp for hours, users open Outsy and get clear, curated outing ideas with the vibe, price, and location already sorted.

The goal is simple: open the app, pick a spot, go out — in under 60 seconds.

Outsy is for individuals, couples, friends, and groups. It covers the full range of outings — not just restaurants and hotels, but activities, events, parks, cafes, bars, hidden gems, and more.

> **The one thing to remember:** Don't build a directory. A directory lists everything. Outsy *recommends* things. The moment it feels like a long list with no personality, you've recreated the exact problem you're solving.

---

## Problem We're Solving

- No easy way to decide quickly — especially in a group
- People keep going back to the same places out of habit
- It's hard to know what you can actually afford before you commit to going somewhere
- Lagos has great spots, but they're hard to discover outside of word-of-mouth

---

## MVP Goals

| Goal | Definition of Done |
|------|--------------------|
| Find a spot in under 60 seconds | Measurable via click path analytics |
| Find a spot in 3 steps or fewer | Home → Filter → Results |
| No account required | Local storage handles saves |
| Admin can manage the platform without touching code | Simple admin dashboard |
| First money comes in before scaling | At least 3 paying businesses |

---

## Core Product Principles

- **Always show something.** No empty states, no blank screens.
- **No accounts.** Everything works without signing up.
- **3 steps max.** Home → filter → results. That's it.
- **Curated, not exhaustive.** Less is more. The curation *is* the product.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js | Fast, mobile-friendly |
| Database | Supabase | Easy to manage content manually |
| Hosting | Vercel | Free tier, fast deploys |
| Saves | Browser localStorage | No backend needed |
| Email | Resend | Send saved lists without a server |
| Analytics | Posthog or Umami | Lightweight, privacy-friendly, strategic |

> 💡 **Suggestion:** Set up Posthog from day one — not just for pageviews, but to track the Golden Sequence (see Metrics section). This will be your most important product signal in the first 3 months.

---

## Features

### Note: Home Screen

The home screen should feel like a recommendation, not a search engine. 


#### Key Features
- **Trending This Week** — spots getting the most "I'm Going Now" signals
- **Outsy Picks** — 5 hand-curated spots, updated every Monday
- **Recommended by Time of Day** — dynamic (morning coffee spots, evening bars, etc.)
- **Collections** — grouped browsing by category and mood (see below)
- **Random Button** — one tap, one spot, no thinking required

#### Collections
Collections are dynamic and updated regularly. Examples:

| Collection Type | Examples |
|----------------|---------|
| Category | Eating · Drinking · Outdoors · Activities |
| Mood/Vibe | Chill · Party Mode · Date Night · Solo Trip |
| Who It's For | With Friends · Couples · Groups |
| Curated | This Weekend's Events · Hidden Gems · Just Added |

> 💡 **Suggestion:** "Just Added" and "Hidden Gems" are great for SEO and word-of-mouth. People love discovering things others don't know about yet — lean into that.

---

### Smart Filter

No search bar — users find spots through a few quick taps. Max 3 results shown at a time, with a shuffle option and a "Pick for me" random button.

| Filter | Options |
|--------|---------|
| Activity | Let's Eat · Grab Drinks · Outdoors · Do an Activity |
| Going with | Friends · Couples · Solo |
| Feeling | Chill · Party · Date Night |
| Budget | Budget · Mid · Splurge |

After filtering, users see up to **3 results**. They can shuffle or let Outsy pick one randomly.

> 💡 **Suggestion:** Consider showing a "Why we picked this" one-liner under each filter result — e.g. *"Good for small groups, walkable from the Island."* It adds personality and builds trust in the curation.

---

### Spot Card

Simple, visual, scroll-stopping. Each card shows:

- Photo
- Name + Area (e.g. Lekki, Ikeja)
- Category + Budget tier
- Vibe tags/badges (e.g. `Chill · Rooftop · Good for Groups`)
- Special badges — only shown where applicable (e.g. `Featured`, `Outsy Pick`, `New`) with bright borders or background colours to stand out

---

### Spot Detail Page

| Section | Content |
|---------|---------|
| Photos | 2–4 high-quality images |
| Location | Area name + Google Maps link |
| Description | 1–2 sentence vibe summary |
| Tags | Vibe + Who It's For (e.g. `Chill · Friends · Solo-friendly`) |
| Budget | Tier (Budget/Mid/Splurge) + rough price range in ₦ |
| Amenities | Wi-Fi, parking, outdoor seating, etc. |
| Best Time to Go | Manual tip (e.g. "Go on weekdays, less crowd") |
| Trust Badge | "Verified by Outsy" or "Solo-dining friendly" |
| Last Verified | Date listing was last checked (e.g. "Verified 2 Apr 2026") |
| Actions | Call · Instagram · Website · Directions |
| I'm Going Now | Intent button — logs signal for trending score |
| Save | Bookmarks spot to Saved tab (localStorage) |
| Share | Share the spot card |
| Quick Compare | Add spot to compare tray |
| Report an Issue | Flag outdated or wrong info — goes to admin queue |

> 💡 **Suggestion:** The "I'm Going Now" button is your most valuable data point. Consider making it more prominent than Save. It tells you which spots are actually converting — not just being browsed.

---

### Spot Comparison

Users can add up to 2–3 spots to a compare tray and view them side by side. Useful for groups deciding between options.

---

## Content Plan

| Type | Volume | Refresh Cadence |
|------|--------|----------------|
| Anchor Spots (evergreen) | 20–30 | Add once, review monthly |
| Rotator Spots (fresh picks) | 20–50 | Swap weekly |
| Outsy Picks | 5 | Every Monday |
| Events | As available | Add as they come in |

**Sourcing:** Instagram, Google Maps, TikTok, personal visits, word of mouth.

> 💡 **Suggestion:** Build a simple sourcing template — spot name, area, category, vibe tags, budget tier, photo links, verification date. Keeping this consistent from the start will save a lot of cleanup later, especially when you scale to more cities.

---

## Monetisation — "Feature Your Spot"

> **Rule:** Charge businesses, not users.

Businesses pay a flat monthly fee to be listed and promoted on Outsy.

| Tier | Price | What They Get |
|------|-------|---------------|
| Basic Listing | ₦15,000/month | Listed on Outsy + Verified badge |
| Featured Spot | ₦35,000/month | Listed + `Featured` label + priority in filter results + included in one Outsy Picks week per month |

### Why Businesses Will Pay
- Cheaper and more targeted than a boosted Instagram post
- Their customers are already the kind of people using Outsy
- No tech setup required — you handle everything
- The `Featured` badge is social proof they can screenshot and repost

### How to Sell It (Manual Outreach)
1. DM the spot on Instagram
2. Show them a screenshot of their listing on Outsy
3. Offer the first 2 weeks free to prove value
4. Convert to paid once they see the map clicks and calls come in

**Target:** 3–5 paying businesses before building anything automated. That's ₦45,000–₦175,000/month from day one.

### Featured Spot Rules
- Maximum **5 Featured Spots** active at any time (scarcity = value)
- Featured spots appear first in filter results — only when they genuinely match the user's filters
- Never shown in irrelevant results

> 💡 **Suggestion:** Create a simple one-pager or PDF deck you can send to businesses after your DM. Include: what Outsy is, who uses it, what they get, and the price. Makes it feel more legit and cuts down the back-and-forth.

---

## Admin Dashboard

An internal tool for managing content and monitoring performance — no code required.

### Sections

**Content Management**
- Add, edit, and archive spots
- Manage collections and rotator spots
- Schedule Outsy Picks

**Verification Queue**

All listings are tracked by how recently they were verified. The queue is sorted into three tiers:

| Tier | Condition | Action |
|------|-----------|--------|
| 🔴 Urgent | Not verified in 30+ days | Re-verify immediately |
| 🟡 Due | Not verified in 14–29 days | Schedule a check this week |
| 🟢 Pending | Not verified in 7–13 days | Monitor, verify soon |

- Each listing shows its last verified date and current tier
- Admin can log a correction note at any time without re-verifying
- User-submitted "Report an Issue" flags appear here, tagged as **User Report**

**Business & Payments Tab**

Track paying businesses manually at MVP.

| Column | Detail |
|--------|--------|
| Business Name | Name of the spot |
| Tier | Basic or Featured |
| Start Date | When their listing began |
| Expiry Date | When it needs renewal |
| Status | Active / Expired / Pending |
| Contact | Instagram handle or phone number |
| Notes | Deal notes (e.g. "first 2 weeks free") |

**Content Calendar**

Tracks weekly:
- Which Outsy Picks are live
- Which Rotator Spots are active
- Which Featured businesses are live
- What's expiring soon (so you can follow up proactively)

---

## Metrics — What to Track

| Metric | Formula | What It Tells You |
|--------|---------|-------------------|
| Discovery Rate | Spot clicks ÷ Home screen views | Are people engaging with content? |
| Intent Rate | "I'm Going Now" clicks ÷ Spot views | Are people actually planning to go? |
| Action Rate | (Map + Call + IG clicks) ÷ Spot views | Are they taking steps to visit? |
| Save Rate | Saves ÷ Spot views | Are they interested in coming back? |
| Business Conversion | Paid listings ÷ Businesses contacted | Is the monetisation working? |

**The Golden Sequence:** *I'm Going Now → Map Click → Call.* If you see this pattern on a spot, someone probably went out tonight. This is your most important signal.

Track weekly in a spreadsheet. Review every Monday and update Outsy Picks based on what's performing.

> 💡 **Suggestion:** Once you have 4–6 weeks of data, look for patterns by time of day and day of week. If Saturday evenings spike, lean into it — schedule your best Rotator Spots to go live on Thursdays so they're fresh for the weekend.

---

## Non-Functional Requirements

| Requirement | Target | How to Test |
|-------------|--------|-------------|
| Filter response time | Results in under 300ms | Browser DevTools on live Supabase query |
| Page speed | Lighthouse score ≥ 85 on mobile and desktop | Run Lighthouse on deployed Vercel URL |
| Scalability | Supports 500 listings; structured for multi-city expansion | Load test with 500 seeded records |
| Usability | Spot reached in 3 steps or fewer | Click-path test: Home → Filter → Results |
| Compatibility | Works on Chrome, Safari, Firefox | Manual cross-browser check before launch |
| Data reliability | No unverified listings go live | Verification log in admin shows zero gaps |
| Data freshness | 30+ day unverified listing triggers Urgent flag | Set a listing's last_verified to 31 days ago; confirm flag appears |

---

## What NOT to Build at MVP

| ❌ Skip | ✅ Do This Instead |
|--------|------------------|
| User accounts / profiles | Browser localStorage for saves |
| AI recommendations | Weighted filter scoring |
| User reviews or ratings | Your own verified descriptions |
| Booking / reservation system | Link to Instagram or WhatsApp |
| iOS / Android app | Mobile-responsive web app |
| Automated payments | Bank transfer or Paystack link manually |
| Multiple cities at once | Master Lagos first, then expand |

---

## Scaling Plan (Post-MVP)

This is not in scope for MVP, but the product should be built with these in mind from the start:

- **Multi-city expansion** — the database schema and admin tools should be city-aware from day one, even if only Lagos is active
- **User accounts (optional)** — if save rates are high and users return frequently, a lightweight account system (email + magic link) may be worth adding
- **Automated business onboarding** — a self-serve listing form + Paystack integration once manual outreach proves the model
- **Notifications** — "New spot added near you" or "Your saved spot has new hours" via email or push

> 💡 **Suggestion:** Before you build anything for scaling, validate with numbers. 500 MAU and ₦100k/month in business revenue would be a clear signal the model works and it's worth investing in automation.

---

*Outsy. Open it. Pick a spot. Go out.*