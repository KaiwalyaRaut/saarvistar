---
name: Mauli Minimal Dark
colors:
  surface: '#2B2B2B'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#dec0b7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a58b83'
  outline-variant: '#57423b'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1900'
  primary-container: '#e46f45'
  on-primary-container: '#511500'
  inverse-primary: '#a23e18'
  secondary: '#fdb69e'
  on-secondary: '#4f2414'
  secondary-container: '#6b3a28'
  on-secondary-container: '#e9a58e'
  tertiary: '#72d4ee'
  on-tertiary: '#003641'
  tertiary-container: '#329db6'
  on-tertiary-container: '#002e38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822801'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#fdb69e'
  on-secondary-fixed: '#351003'
  on-secondary-fixed-variant: '#6b3a28'
  tertiary-fixed: '#adecff'
  tertiary-fixed-dim: '#72d4ee'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  muted: '#8B8B8B'
  text: '#EAEAEA'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Mauli — Design System (v0.1)

GenAI content transformation platform. Dark-theme, minimal, chat-style interface.

## Brand mark

Six-petal radial symbol, single flat accent color, rounded center core. Reads as one mark at any size (favicon, sidebar icon, header lockup). No gradients, no drop shadows.

## Color palette — Neutral minimal (single accent)

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#151515` | App background |
| `surface` | `#2B2B2B` | Cards, input bar, sidebar, dropup menus |
| `accent` | `#C85A32` | Primary buttons, active states, "+" icon, selected output-type chips, links (warm terracotta/rust as requested) |
| `muted` | `#8B8B8B` | Secondary text, placeholder text, inactive icons |
| `text` | `#EAEAEA` | Primary body/heading text |

Rules:
- One accent color only. Don't introduce a second brand hue — use `muted`/`surface` for all non-interactive UI weight.
- `text` on `bg`/`surface` for body copy; `accent` reserved for things the user can click or that indicate active/selected state.
- No light theme at MVP — dark only.

## Typography

- Sans-serif throughout (system UI font stack or Inter).
- Headings (greeting, section labels): medium weight, `text` color.
- Body/input text: regular weight, `text` color.
- Placeholder text, hints, timestamps: `muted` color, same size as body.

## Spacing & shape

- Rounded corners throughout: 8px on small elements (buttons, chips), 12–16px on containers (input bar, cards, dropup menus).
- Generous whitespace — avoid dashboard-density layouts; this is a chat-style single-focus screen, not a data-dense admin panel.
