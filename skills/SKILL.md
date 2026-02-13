---
name: pencil-design-system
description: >
  This skill should be used when the user asks to "create a design system",
  "build a design system for [business]", "design a UI kit", "create
  components in Pencil", "build screens for [industry]", "set up design
  tokens", or wants to generate a comprehensive, domain-tailored design
  system with variables, themes, reusable components, and example screens
  in a .pen file. Also triggered by "design system from scratch", "build
  a component library", or "create themed UI for [business type]".
version: 1.0.0
license: MIT
metadata:
  author: jsstech
  tags: design-system, pencil, ui-kit, components, tokens, domain-aware
---

# Pencil Design System Generator

Generate a complete, Mews-inspired design system in a Pencil `.pen` file. Research the business domain, create ~60 themed tokens, build visual foundation documentation, ~25 reusable components organized by category, and composition patterns — all from a single prompt like "build a design system for a bakery." Domain screens are generated only if the user explicitly requests them.

## Input

The user provides a **business domain** (e.g., "bakery", "fitness app", "SaaS dashboard"). Optional extras: brand name, color preferences, font preferences, specific screens wanted, light/dark theme preference. If the user gives only a domain, infer everything else from research.

**If the user specifies colors or fonts:** Use their values as the primary/accent/background tokens in Phase 3 and derive the remaining palette around them (secondary, muted, foregrounds). Research still runs to fill in gaps, but user preferences take priority over both research and fallback tables.

## Canvas Organization

The canvas is laid out left-to-right in three core sections (always created), plus an optional screens section:

```
[Foundations 1440×2400] → 100px gap → [Components 1440×2400] → 100px gap → [Patterns 1440×1800] → (optional) [Screens →]
```

- **Foundations** — Visual documentation: color palette swatches, typography specimens, spacing scale, elevation examples, border radius showcase.
- **Components** — All ~25 reusable components, organized under category sub-frames (Buttons, Inputs, Typography, Badges, Alerts, Cards, Navigation, Tables, etc.).
- **Patterns** — Composition showcases: form pattern, data display pattern, navigation pattern, card layout pattern. Each uses component refs to demonstrate real usage.
- **Screens** *(only if user requests)* — 3–5 domain-relevant screens placed to the right of Patterns.

No components live at the document root except these section frames and the optional navigation index.

## Workflow

Execute these 10 phases in order. Each phase builds on the previous. Never skip phases. Reference files in `references/` contain detailed specs — load them as each phase begins.

### Phase 1 — Research the Domain

Use `WebSearch` to study the domain's design conventions. Identify five pillars: color palette, typography, imagery themes, screen inventory, and UI density/tone. Document findings as a design brief.

**Typography is research-driven, not table-driven.** Run specific font research queries (e.g., `"bakery website fonts 2026"`, `"best Google Fonts for bakery"`) and validate against 3–5 real websites in the domain. The font pairing table in `domain-research-guide.md` is a fallback — always prefer research-validated choices. See `references/domain-research-guide.md`.

### Phase 2 — Initialize the Pencil Document

1. Call `get_editor_state({ include_schema: true })`.
2. If no active document, call `open_document("new")`.
3. Call `get_guidelines({ topic: "design-system" })`.
4. Call `get_style_guide_tags()` then `get_style_guide({ tags: [...] })` with 5–10 domain-matching tags.
5. Call `get_variables({ filePath })` to check for existing tokens.

Merge the style guide with Phase 1 research to form the final design direction.

### Phase 3 — Create Design Tokens

Call `set_variables` to create the full token system (~60 tokens). Every color, font, radius, spacing value, shadow, font size, and line height is a variable.

**Handling user-specified colors:** If the user provided color preferences (e.g., "terracotta and cream"), map them to the appropriate tokens (`--primary`, `--background`, `--accent`) and derive the rest of the palette (secondary, muted, foregrounds, borders) to complement. The industry palette tables are starting points, not mandates.

**Post-creation color changes:** Since all components use `$--` token references (not hardcoded hex), calling `set_variables` again with new color values updates the entire design system instantly — every component, pattern, and screen inherits the change. No per-node updates needed.

**Token categories:**

| Category | Count | Examples |
|----------|-------|---------|
| Core colors | 19 | `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` |
| Semantic colors | 8 | `--color-success`, `--color-warning`, `--color-error`, `--color-info` + foregrounds |
| Typography | 3 | `--font-primary`, `--font-secondary`, `--font-mono` |
| Border radius | 6 | `--radius-none` (0) through `--radius-pill` (9999) |
| Spacing | 12 | `--space-1` (4) through `--space-24` (96) |
| Shadows | 4 | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |
| Font sizes | 9 | `--text-xs` (12) through `--text-5xl` (48) |
| Line heights | 3 | `--leading-tight` (1.25), `--leading-normal` (1.5), `--leading-relaxed` (1.75) |

Set up theme axis `{ "mode": ["light", "dark"] }`. All token values are domain-tailored. See `references/design-tokens-reference.md` for full JSON payloads.

**Post-creation verification:** After calling `set_variables`, immediately call `get_variables` and verify that every color token's values show `"theme":{"mode":"light"}` and `"theme":{"mode":"dark"}` (not `"theme":{}`). If theme mappings are missing, the `set_variables` call used the wrong format — see the CRITICAL warning in `design-tokens-reference.md`.

### Phase 4 — Build Foundations (Visual Documentation)

Create the Foundations section frame at the left of the canvas. Inside it, build 5 visual documentation frames:

1. **Color Palette** — Grid of labeled swatches for all 27 color tokens.
2. **Typography Scale** — 6 specimens (H1 → Caption) rendered at real sizes with metadata labels.
3. **Spacing Scale** — 12 visual blocks showing each spacing value with labels.
4. **Elevation** — 4 cards demonstrating shadow levels.
5. **Border Radius** — 6 rectangles showcasing each radius token.

**Critical: Use a neutral white backdrop (`fill: "#FFFFFF"`), NOT the design system's own `$--background` token.** The Foundations section is documentation chrome — using the themed background (e.g., cream for a bakery, blue-gray for SaaS) makes light swatches like `--card`, `--secondary`, and `--muted` nearly invisible. A neutral white surface lets every color be evaluated accurately against a known reference. Swatches use `$--` tokens for their fills; only the documentation frame itself is neutral.

These are documentation frames, NOT reusable components. They use `$--` tokens for swatch fills everywhere. See `references/foundations-specs.md` for exact `batch_design` code (spread across 3 calls within 25-op limits).

After each batch, call `get_screenshot` to verify rendering.

### Phase 5 — Build Base Components (~15 Primitives)

Create the Components section frame to the right of Foundations with `fill: "#FFFFFF"` (same neutral backdrop rationale as Foundations — light-fill variants like Ghost buttons and muted badges need a known white reference). Inside it, create category sub-frames with titles and display rows. Insert components under their category frame — NOT at document root.

| Batch | Category | Components | Count |
|-------|----------|-----------|-------|
| 1 | Buttons | Primary, Secondary, Outline, Ghost, Destructive | 5 |
| 2 | Inputs | TextField, Textarea, Select, InputGroup | 4 |
| 3 | Typography | H1, H2, H3, Body, Caption, Label | 6 |
| 4 | Badges | Default, Success, Warning, Error | 4 |
| 5 | Alerts | Info, Success, Warning, Error | 4 |

Every component has `reusable: true`, uses only `$--` tokens, and follows `"Category/Variant"` naming. See `references/component-specs.md`.

**MANDATORY — Post-Batch Validation (after EVERY batch_design call):**
1. Check the batch response for "unknown properties were ignored" warnings — fix immediately.
2. Call `get_screenshot` on the affected section — visually confirm no overlapping elements, no invisible shadows, no broken layouts.
3. If ANY horizontal arrangement shows items stacked/overlapping, the frame is missing `layout: "horizontal"`. Fix it before proceeding to the next batch.

### Phase 6 — Build Composite Components (~10 Composites)

Continue inside the Components section frame, adding category sub-frames for each composite group.

| Batch | Category | Components | Count |
|-------|----------|-----------|-------|
| 6 | Card | Header + Content + Actions slots | 1 |
| 7 | Navigation | Sidebar container, ActiveItem, DefaultItem, SectionTitle | 4 |
| 8 | Table | Wrapper, HeaderRow, DataRow | 3 |
| 9 | Tabs | Container, ActiveTab, InactiveTab | 3 |
| 10 | Breadcrumbs | Item, Separator, ActiveItem | 3 |
| 11 | Pagination | Container, PageItem, ActiveItem, PrevNext | 4 |
| 12 | Modal | Dialog with Header/Body/Footer | 1 |
| 13 | Dropdown | Container, Item, Divider, SectionTitle | 4 |
| 14 | Misc | Avatar, Divider, Switch, Checkbox, Radio | 5 |

After batches 8, 11, and 14: run `get_screenshot` and `snapshot_layout({ problemsOnly: true })`. Fix issues immediately. See `references/component-specs.md`.

### Phase 7 — Build Patterns (Composition Showcases)

Create the Patterns section frame to the right of Components. Build 4 composition showcases that demonstrate real usage of the components:

1. **Form Pattern** — Vertical stack of InputGroup refs + Submit button.
2. **Data Display Pattern** — Table ref with populated rows + Pagination ref.
3. **Navigation Pattern** — Sidebar ref + Breadcrumbs ref + Tabs ref.
4. **Card Layout Pattern** — Grid of populated Card refs with images and domain content.

Each pattern uses only `ref` instances + `$--` tokens. **After each pattern, run the Post-Batch Validation** (screenshot + check for overlapping/broken layouts). See `references/screen-patterns.md`.

### Phase 8 — Create Domain Screens *(only if user requests)*

**Skip this phase unless the user explicitly asks for screens** (e.g., "build screens for a bakery", "I need a landing page and menu screen", "create example screens"). The core deliverable is Foundations + Components + Patterns — screens are an optional add-on.

If the user requests screens, build 3–5 placed to the right of the Patterns section. Each screen uses only component `ref` instances and `$--` variable tokens.

**Per-screen workflow:**
1. Call `find_empty_space_on_canvas({ direction: "right", width: 1440, height: 900, padding: 100 })`.
2. Insert screen frame at returned position.
3. Build layout with component refs. Customize via `U(instanceId+"/descendantId", {...})`.
4. Add domain imagery via `G()`.
5. Call `get_screenshot` to verify.

See `references/screen-patterns.md` for domain-specific screen templates.

### Phase 9 — Layout Enforcement Pass (MANDATORY)

**Why this exists:** The AI consistently drops `layout: "horizontal"` from frames during generation, even when specs include it. This pass programmatically catches and fixes every missing layout. **This phase is NOT optional — skip it and the design will have broken layouts.**

**Step 1 — Collect all frames with flex properties.**
```
batch_get({ filePath, patterns: [{ type: "frame" }], searchDepth: 10, readDepth: 0 })
```
Search within EACH top-level section (Foundations, Components, Patterns, and any screens).

**Step 2 — Identify frames needing layout enforcement.**
From the results, find every frame that has ANY of: `gap`, `alignItems`, `justifyContent` — regardless of whether `layout` already appears (since `batch_get` doesn't display `layout: "horizontal"` in its output — it's considered the default).

**Step 3 — Bulk-apply `layout: "horizontal"` to ALL identified frames.**
```javascript
U("frameId1", { layout: "horizontal" })
U("frameId2", { layout: "horizontal" })
// ... for every frame with gap/alignItems/justifyContent
```
Exclude frames that should be vertical (identifiable by name: category sections, form containers, vertical stacks). Apply `layout: "vertical"` to those instead.

**Step 4 — Verify shadows use hex colors.**
Check any frame with `effect` property. If `color` uses `rgba()` format, replace with 8-digit hex `#RRGGBBAA`.

**Step 5 — Screenshot every section** to confirm no overlapping elements.

This is safe to run multiple times — setting `layout: "horizontal"` on a frame that already has it is a no-op.

### Phase 10 — Final Verification

Run comprehensive QA. Fix every issue before presenting to the user.

1. **Visual** — `get_screenshot` on Foundations, Components, Patterns (and screens if created). Check alignment, spacing, typography, color, overflow.
2. **Layout** — `snapshot_layout({ problemsOnly: true })` to detect clipping/overflow. Fix all.
3. **Token audit** — `search_all_unique_properties` for `fillColor`, `textColor`, `fontFamily`, `fontSize`. Replace leaked hex values and raw font sizes with `$--` tokens.
4. **Component audit** — `batch_get({ patterns: [{ reusable: true }] })`. Verify ~25 components.
5. **Organization audit** — Verify no orphan components at document root. All should be under Components section.
6. **Fix and re-verify** — Re-screenshot affected areas after fixes.
7. **Present** — Summarize tokens, components, patterns (and screens if created). Show key screenshots.

See `references/verification-checklist.md`.

### Phase 11 — Canvas Navigation Index

Create a small navigation index frame at the canvas origin (x: 0, y: 0) showing a map of all sections with their positions:

```
Design System Index
├── Foundations (x, y)
├── Components (x, y)
├── Patterns (x, y)
└── Screens (x, y) — only if screens were created
```

This helps users navigate the canvas. Only include the Screens entry if Phase 8 was executed.

### Phase 12 — Code Export *(optional, user-triggered)*

**Skip this phase unless the user explicitly requests code export** (e.g., "export to Tailwind", "convert to code", "generate React components", "export as CSS"). This phase converts the design system into production-ready Tailwind CSS + React components.

**Step 1 — Collect preferences.** Ask the user for:
- **Tailwind version:** v3 or v4
- **Framework:** Next.js or Vite+React

**Step 2 — Extract tokens.** Call `get_variables({ filePath })` to read all ~64 tokens. Categorize by type (color, number, string, shadow). Separate themed (light/dark) from static tokens.

**Step 3 — Read components.** Call `batch_get({ patterns: [{ reusable: true }], readDepth: 3, searchDepth: 3 })` to get every reusable component with its full node tree.

**Step 4 — Load Pencil's code generation guidelines.** Call `get_guidelines("code")` and `get_guidelines("tailwind")`. These are the **primary authority** for translating Pencil nodes to code — they cover component instance mapping, property-to-Tailwind-class translation, font wiring, and visual verification. Follow them for all translation work in Steps 8-9.

**Step 5 — Generate `globals.css`.** Build the CSS file with all tokens as CSS custom properties:
- **v3:** `:root` with HSL values (space-separated, no `hsl()` wrapper), `.dark` overrides, `@layer base` font utilities
- **v4:** `@import "tailwindcss"`, `@custom-variant dark`, `:root` with hex values, `.dark` overrides, `@layer base` font utilities

**Step 6 — Generate `tailwind.config.js` (v3 only).** Map all tokens to Tailwind utility names: colors via `hsl(var(--name))`, radii, shadows, font sizes, spacing, line heights.

**Step 7 — Generate font loading code.**
- **Next.js:** `layout.tsx` with `next/font/google` loader setting `--font-primary`, `--font-secondary`, `--font-mono` CSS variables
- **Vite+React:** `<link>` tags in `index.html` loading all three fonts from Google Fonts

**Step 8 — Generate component TSX files.** One file per component category (button.tsx, input.tsx, card.tsx, badge.tsx, alert.tsx, etc.). Each component:
- Uses only token-referencing Tailwind classes (no hardcoded hex)
- Has TypeScript interfaces with variant props where applicable
- Accepts and spreads an optional `className` prop
- Uses v3 mapped classes (`bg-primary`) or v4 arbitrary values (`bg-[var(--primary)]`) based on the chosen version

**Step 9 — Generate screen/page TSX files.** For each screen design in the .pen file:
1. Deep-read the screen frame: `batch_get({ nodeIds: [screenId], readDepth: 10, resolveInstances: true })`
2. Take a reference screenshot: `get_screenshot({ nodeId: screenId })`
3. Follow **Pencil's Component Implementation Workflow** (from Step 4's `get_guidelines("code")`):
   - Steps 1A-1C: Extract components, map ALL instances with ALL overrides and descendants
   - Step 2: Create React components using `get_guidelines("tailwind")` for property-to-class mapping
   - Step 3: Validate each component with `get_screenshot` — pixel-perfect match required
   - Step 4: Integrate into frame, verify instance count and prop completeness
4. Handle screen-level elements: semantic HTML for headings/labels/links, page wrapper, form behavior, icon name conversion, image fills
5. Assemble into a complete page file with all imports
6. Visually verify the rendered page against the Pencil screenshot — fix any discrepancies

See `references/code-export-guide.md` (Section 7) for the complete screen export workflow and common pitfalls.

## Critical Rules

**Rule 1 — Always reuse components.** Search with `batch_get({ patterns: [{ reusable: true }] })` before creating. On screens, every element must be a `ref` instance.

**Rule 2 — Never hardcode values.** All colors use `$--` tokens. All fonts use `$--font-*`. All radii use `$--radius-*`. All font sizes use `$--text-*`. Raw values only appear in `set_variables`.

**Rule 3 — Prevent overflow.** Constrain text with `width: "fill_container"`. Use layout frames. Validate with `snapshot_layout({ problemsOnly: true })`.

**Rule 4 — Verify visually.** Call `get_screenshot` after every major batch. Fix problems immediately.

**Rule 5 — Reuse assets.** Copy images with `C()` instead of regenerating with `G()`.

**Rule 6 — Domain coherence.** Every choice connects back to Phase 1 research.

**Rule 7 — Canvas organization.** All components go inside the Components section frame under categorized sub-frames. No components at document root. Foundations, Components, Patterns, and Screens flow left-to-right on the canvas.

## Component Inventory

| # | Component | Type | Variants |
|---|-----------|------|----------|
| 1–5 | Button | Primitive | Primary, Secondary, Outline, Ghost, Destructive |
| 6–9 | Input | Primitive | TextField, Textarea, Select, InputGroup |
| 10–15 | Typography | Primitive | H1, H2, H3, Body, Caption, Label |
| 16–19 | Badge | Primitive | Default, Success, Warning, Error |
| 20–23 | Alert | Primitive | Info, Success, Warning, Error |
| 24 | Card | Composite | Header + Content + Actions slots |
| 25–28 | Sidebar Nav | Composite | Container, ActiveItem, DefaultItem, SectionTitle |
| 29–31 | Table | Composite | Wrapper, HeaderRow, DataRow |
| 32–34 | Tabs | Composite | Container, ActiveTab, InactiveTab |
| 35–37 | Breadcrumbs | Composite | Item, Separator, ActiveItem |
| 38–41 | Pagination | Composite | Container, PageItem, ActiveItem, PrevNext |
| 42 | Modal/Dialog | Composite | Overlay + Content with slots |
| 43–46 | Dropdown | Composite | Container, MenuItem, Divider, SectionTitle |
| 47–51 | Miscellaneous | Composite | Avatar, Divider, Switch, Checkbox, Radio |

## References

Load the relevant file before starting each phase:

- **`references/pencil-mcp-guide.md`** — Complete Pencil MCP tool reference with examples and operation syntax.
- **`references/domain-research-guide.md`** — Domain research strategies, color psychology, font pairings, screen inventories.
- **`references/design-tokens-reference.md`** — Token architecture, `set_variables` JSON payloads, ~60 token definitions, industry palettes.
- **`references/foundations-specs.md`** — Visual foundation documentation: color palette, typography scale, spacing, elevation, radius `batch_design` code.
- **`references/component-specs.md`** — All ~25 component `batch_design` operation code with section frame organization.
- **`references/screen-patterns.md`** — Layout patterns, composition showcases, and domain-specific screen templates.
- **`references/verification-checklist.md`** — Visual QA, layout checks, token audits, canvas organization verification.
- **`references/code-export-guide.md`** — Tailwind CSS export: token extraction, v3/v4 templates, Pencil-to-Tailwind class cheatsheet, component translation, framework setup (Next.js / Vite+React).
