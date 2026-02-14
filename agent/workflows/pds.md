---
description: Generate a complete Pencil design system with tokens, foundations, components, and patterns for any business domain.
---

# Pencil Design System Generator

Generate a complete design system in a Pencil `.pen` file. This workflow runs step by step, pausing at each phase for your review.

## Input

Parse the user's message for: business domain, brand name, color preferences, font preferences, **reference image**. If only a domain is given, research everything else. If a reference image is provided (on canvas, in chat, or as URL), it becomes the primary design input.

## Workflow

Execute these phases **one at a time**. After completing each phase, present the review and END YOUR RESPONSE. Do NOT continue to the next phase until the user replies. Do NOT repeat your previous message. If you have already completed a phase and shown the review, say nothing more — just wait.

At each **REVIEW** point, the user will type `c` (continue), `r` (redo), or `s` (skip to verification).

### Phase 1 — Research the Domain

1. **If `collectui-mcp` is available:** Call `collectui_search({ query: "[domain]", limit: 8 })` first. Analyze the returned design screenshots — extract dominant colors (hex), typography patterns, layout styles, corner radii, shadow depth. Use these as strong design signals.
2. **If reference image exists** (on canvas or in chat): Analyze it first. Extract dominant colors (hex), typography style, tone, corner radius, shadow depth. This is the PRIMARY design source.
3. Search the web for design conventions for the given domain:
   - Color palettes used by real websites in this domain
   - Font pairings (search "[domain] website fonts 2026")
   - UI tone and density
4. Compile a design brief with: primary color, secondary color, accent color, background color, heading font, body font, tone. **Priority: reference image > Collect UI visual research > user preferences > web research.**

**REVIEW** — Show the design brief, then END YOUR RESPONSE. Do not continue until the user replies with `c`, `r`, or `s`.

### Phase 2 — Initialize Pencil Document

1. Call `get_editor_state({ include_schema: true })`. Check the response for an active `.pen` file.
   - **If a `.pen` file IS already open:** Use it. Do NOT call `open_document`. Note the `filePath`.
   - **If NO `.pen` file is open:** Create a named file: `open_document("[domain]-design-system.pen")` (e.g., `"coffee-shop-design-system.pen"`). Use the domain from user input, kebab-cased. Do NOT use `"new"`.
   - **NEVER create a second document.** Only ONE `.pen` file should exist.
2. Call `get_guidelines({ topic: "design-system" })`.
3. Call `get_style_guide_tags()` then `get_style_guide({ tags: [...] })` with 5-10 domain tags.
4. Call `get_variables({ filePath })` to check for existing tokens.

### Phase 3 — Create Design Tokens

Call `set_variables` to create ~64 themed tokens. Every color, font, radius, spacing, shadow, font size, and line height is a variable.

**CRITICAL — Exact format. Copy this structure. Do NOT deviate.**

CORRECT — color tokens (themed):
```json
{
  "--primary": {
    "type": "color",
    "value": [
      { "value": "#3E2723", "theme": { "mode": "light" } },
      { "value": "#D7CCC8", "theme": { "mode": "dark" } }
    ]
  }
}
```

CORRECT — non-color tokens (no theme):
```json
{
  "--font-primary": { "type": "string", "value": [{ "value": "Fraunces, serif" }] },
  "--radius-md":    { "type": "number", "value": [{ "value": 6 }] }
}
```

WRONG — these break theming:
```
{ "value": "#HEX", "theme": {} }           // empty theme = broken
{ "themes": { "mode": ["light","dark"] } }  // themes key in variables = error
{ "values": [...] }                          // "values" plural = wrong key
```

Token categories: 19 core colors, 8 semantic colors, 3 fonts, 6 radii, 12 spacing, 4 shadows, 9 font sizes, 3 line heights.

**Semantic colors MUST be derived from the primary palette** — match temperature (warm/cool), saturation, and lightness. Do NOT use default Tailwind green/amber/red/blue. Warm muted palette → sage green, golden amber, terracotta red, dusty blue. Cool vivid palette → teal-green, gold, crimson, harmonic blue.

**After `set_variables`, call `get_variables` and verify EVERY color token shows `"theme":{"mode":"light"}` and `"theme":{"mode":"dark"}`.** If ANY color shows `"theme":{}` (empty), the format was wrong — redo before continuing.

**REVIEW** — Show token count by category, then END YOUR RESPONSE. Do not continue until the user replies with `c`, `r`, or `s`.

### Phase 4 — Build Foundations

Create Foundations section frame with `width: 1440, height: "fit_content", layout: "vertical", fill: "#FFFFFF"`. **Do NOT use fixed heights** — always use `height: "fit_content"` so frames grow to fit content. Build 5 documentation frames:
1. Color Palette (27 swatches) — **Split into rows of max 5-6 per row** to prevent overflow. Use a vertical container with multiple horizontal rows (e.g., Row 1: Primary, Secondary, Accent, Background, Card. Row 2: Success, Warning, Destructive, Muted, Input, Border). Each swatch ~140-160px wide.
2. Typography Scale (6 specimens) — vertical stack
3. Spacing Scale (12 blocks) — 2 rows of 6
4. Elevation (4 shadow cards) — single horizontal row
5. Border Radius (6 shapes) — single horizontal row

All swatches use `$--` token fills. Use `batch_design` with max 25 ops per call. Call `get_screenshot` after each batch.

**REVIEW** — Show screenshot, then END YOUR RESPONSE. Do not continue until the user replies with `c`, `r`, or `s`.

### Phase 5 — Build Components

Create Components section frame at x:1540 with `width: 1440, height: "fit_content", layout: "vertical", fill: "#FFFFFF"`. Build ~25 reusable components in explicit batches. **Do NOT stop early. Complete ALL batches below.**

All components: `reusable: true`, `$--` tokens only, `"Category/Variant"` naming.

**Batch 1 — Buttons (5):** Primary, Secondary, Outline, Ghost, Destructive. Each: frame with text + optional icon, `layout: "horizontal"`, `cornerRadius: "$--radius-md"`. Call `get_screenshot`.

**Batch 2 — Inputs (4):** TextField, Textarea, Select, InputGroup (label + input). Each: frame with border, placeholder text. Call `get_screenshot`.

**Batch 3 — Typography (6):** H1, H2, H3, Body, Caption, Label. Text nodes with `$--text-*` and `$--font-*` tokens. Call `get_screenshot`.

**Batch 4 — Badges + Alerts (8):** Badge/Default, Badge/Success, Badge/Warning, Badge/Error, Alert/Info, Alert/Success, Alert/Warning, Alert/Error. Call `get_screenshot`.

**Batch 5 — Card + Navigation (5):** Card (header+content+actions), Sidebar container, NavItem/Active, NavItem/Default, Nav/SectionTitle. Call `get_screenshot`.

**Batch 6 — Table + Tabs + Breadcrumbs (9):** Table/Wrapper, Table/HeaderRow, Table/DataRow, Tabs/Container, Tabs/Active, Tabs/Inactive, Breadcrumbs/Item, Breadcrumbs/Separator, Breadcrumbs/Active. Call `get_screenshot`.

**Batch 7 — Pagination + Modal + Misc (10):** Pagination/Container, Pagination/Page, Pagination/Active, Pagination/PrevNext, Modal/Dialog, Dropdown/Container, Dropdown/Item, Avatar, Switch, Divider. Call `get_screenshot`.

After ALL batches: verify with `batch_get({ patterns: [{ reusable: true }] })`. Must show ~25+ components.

**REVIEW** — Show component count and screenshot, then END YOUR RESPONSE. Do not continue until the user replies with `c`, `r`, or `s`.

### Phase 6 — Build Patterns

Create Patterns section frame with `width: 1440, height: "fit_content", layout: "vertical"`. Build 4 composition showcases using component refs:
1. Form Pattern — vertical stack of InputGroup refs + Submit button (`layout: "vertical"`)
2. Data Display Pattern — Table + Pagination stacked vertically
3. Navigation Pattern — horizontal layout: sidebar (`layout: "vertical"`, width: 240) + content area (`layout: "vertical"`, `width: "fill_container"`). **Sidebar MUST be `layout: "vertical"`** so nav items stack.
4. Card Layout Pattern — horizontal row of Card refs (`layout: "horizontal"`, `gap: 24`). **Add domain images** to cards: insert a frame inside the card, then `G(frame, "stock", "[domain keyword]")`.

**Images:** Use `G()` to add domain-relevant visuals:
- Card images: `G(imageFrame, "stock", "latte art")` (use domain keywords)
- Avatars: `G(avatarFrame, "stock", "professional portrait")`
- Insert frame FIRST, then apply `G()` — images are fills on frames

**Every frame MUST have explicit `layout: "horizontal"` or `layout: "vertical"`.** Sidebars and nav containers are ALWAYS vertical.

**REVIEW** — Show screenshot, then END YOUR RESPONSE. Do not continue until the user replies with `c`, `r`, or `s`.

### Phase 7 — Domain Screens (optional)

Only if user requested screens. Build 3-5 screens using component refs.

### Phase 8 — Verify + Fix

1. Layout enforcement — ensure all frames with gap/alignItems have explicit layout
2. Shadow fix — replace rgba() with 8-digit hex
3. Visual check — screenshot all sections
4. Token audit — replace leaked hex values with `$--` tokens
5. Component audit — verify ~25 reusable components

Report final summary: token count, component count, sections created, screenshots.
