---
description: Generate a complete Pencil design system with tokens, foundations, components, and patterns for any business domain.
---

# Pencil Design System Generator

Generate a complete design system in a Pencil `.pen` file. This workflow runs step by step, pausing at each phase for your review.

## Input

Parse the user's message for: business domain, brand name, color preferences, font preferences. If only a domain is given, research everything else.

## Workflow

Execute these phases in order. At each review point, STOP and wait for the user to type `c` (continue), `r` (redo), or `s` (skip to verification).

### Phase 1 — Research the Domain

1. Search the web for design conventions for the given domain:
   - Color palettes used by real websites in this domain
   - Font pairings (search "[domain] website fonts 2026")
   - UI tone and density
2. Compile a design brief with: primary color, secondary color, accent color, background color, heading font, body font, tone.

**REVIEW** — Show the design brief. Wait for `c`, `r`, or `s`.

### Phase 2 — Initialize Pencil Document

1. Call `get_editor_state({ include_schema: true })`. If no document, call `open_document("new")`.
2. Call `get_guidelines({ topic: "design-system" })`.
3. Call `get_style_guide_tags()` then `get_style_guide({ tags: [...] })` with 5-10 domain tags.
4. Call `get_variables({ filePath })` to check for existing tokens.

### Phase 3 — Create Design Tokens

Call `set_variables` to create ~64 themed tokens. Every color, font, radius, spacing, shadow, font size, and line height is a variable.

CRITICAL FORMAT — every variable needs a `type` property. Do NOT include a `themes` key in the variables object. Themes auto-register from usage:

```
"--primary": {
  "type": "color",
  "value": [
    { "value": "#HEX", "theme": { "mode": "light" } },
    { "value": "#HEX", "theme": { "mode": "dark" } }
  ]
}
```

Token categories: 19 core colors, 8 semantic colors, 3 fonts, 6 radii, 12 spacing, 4 shadows, 9 font sizes, 3 line heights.

After `set_variables`, call `get_variables` and verify all color tokens have light+dark entries.

**REVIEW** — Show token count by category. Wait for `c`, `r`, or `s`.

### Phase 4 — Build Foundations

Create Foundations section frame (1440x2400) with fill `#FFFFFF`. Build 5 documentation frames:
1. Color Palette (27 swatches)
2. Typography Scale (6 specimens)
3. Spacing Scale (12 blocks)
4. Elevation (4 shadow cards)
5. Border Radius (6 shapes)

All swatches use `$--` token fills. Use `batch_design` with max 25 ops per call. Call `get_screenshot` after each batch.

**REVIEW** — Show screenshot. Wait for `c`, `r`, or `s`.

### Phase 5 — Build Components

Create Components section frame (1440x2400) at x:1540. Build ~25 reusable components:
- Buttons (5), Inputs (4), Typography (6), Badges (4), Alerts (4)
- Card (1), Navigation (4), Table (3), Tabs (3), Breadcrumbs (3)
- Pagination (4), Modal (1), Dropdown (4), Misc (5)

All components: `reusable: true`, `$--` tokens only, `"Category/Variant"` naming. Call `get_screenshot` after every batch.

**REVIEW** — Show component count and screenshot. Wait for `c`, `r`, or `s`.

### Phase 6 — Build Patterns

Create Patterns section frame (1440x1800). Build 4 composition showcases using component refs:
1. Form Pattern
2. Data Display Pattern
3. Navigation Pattern
4. Card Layout Pattern

**REVIEW** — Show screenshot. Wait for `c`, `r`, or `s`.

### Phase 7 — Domain Screens (optional)

Only if user requested screens. Build 3-5 screens using component refs.

### Phase 8 — Verify + Fix

1. Layout enforcement — ensure all frames with gap/alignItems have explicit layout
2. Shadow fix — replace rgba() with 8-digit hex
3. Visual check — screenshot all sections
4. Token audit — replace leaked hex values with `$--` tokens
5. Component audit — verify ~25 reusable components

Report final summary: token count, component count, sections created, screenshots.
