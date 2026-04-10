# Outsy — Brand Color Palette

## Light Mode

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#E8573A` | CTAs, active states, "I'm Going Now" button |
| Primary text | `#FFFFFF` | Text on primary backgrounds |
| Secondary | `#1B2A4A` | Headers, navs, strong text |
| Accent | `#F9A825` | Highlights, badges, featured indicators |
| Background | `#FDFBF9` | Page background |
| Surface | `#FFF5F0` | Cards, elevated containers |
| Card | `#FFF0EB` | Spot cards, comparison cards |
| Chip background | `#FEE8E0` | Filter chips, vibe tags |
| Chip text | `#C0392B` | Text on chips |
| Badge background | `#E8573A` | "Outsy Pick", "Featured" badges |
| Badge text | `#FFFFFF` | Text on badges |
| Text | `#1B2A4A` | Primary body text |
| Text muted | `#6B7280` | Secondary/supporting text |

## Dark Mode

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#F06B50` | CTAs, active states, "I'm Going Now" button |
| Primary text | `#FFFFFF` | Text on primary backgrounds |
| Secondary | `#3B82F6` | Links, secondary actions |
| Accent | `#FBBF24` | Highlights, badges, featured indicators |
| Background | `#0F1623` | Page background |
| Surface | `#1A2332` | Cards, elevated containers |
| Card | `#1E2B3A` | Spot cards, comparison cards |
| Chip background | `#2D1A14` | Filter chips, vibe tags |
| Chip text | `#F4845F` | Text on chips |
| Badge background | `#F06B50` | "Outsy Pick", "Featured" badges |
| Badge text | `#FFFFFF` | Text on badges |
| Text | `#F1F5F9` | Primary body text |
| Text muted | `#94A3B8` | Secondary/supporting text |

## CSS Variables

```css
/* Light mode */
:root {
  --color-primary: #E8573A;
  --color-primary-text: #FFFFFF;
  --color-secondary: #1B2A4A;
  --color-accent: #F9A825;
  --color-bg: #FDFBF9;
  --color-surface: #FFF5F0;
  --color-card: #FFF0EB;
  --color-chip-bg: #FEE8E0;
  --color-chip-text: #C0392B;
  --color-badge-bg: #E8573A;
  --color-badge-text: #FFFFFF;
  --color-text: #1B2A4A;
  --color-text-muted: #6B7280;
}

/* Dark mode */
[data-theme="dark"] {
  --color-primary: #F06B50;
  --color-primary-text: #FFFFFF;
  --color-secondary: #3B82F6;
  --color-accent: #FBBF24;
  --color-bg: #0F1623;
  --color-surface: #1A2332;
  --color-card: #1E2B3A;
  --color-chip-bg: #2D1A14;
  --color-chip-text: #F4845F;
  --color-badge-bg: #F06B50;
  --color-badge-text: #FFFFFF;
  --color-text: #F1F5F9;
  --color-text-muted: #94A3B8;
}
```

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-text': 'var(--color-primary-text)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        'chip-bg': 'var(--color-chip-bg)',
        'chip-text': 'var(--color-chip-text)',
        'badge-bg': 'var(--color-badge-bg)',
        'badge-text': 'var(--color-badge-text)',
        'text-main': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
      },
    },
  },
};
```
