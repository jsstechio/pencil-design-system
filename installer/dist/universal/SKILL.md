---
name: pds
description: >
  Pencil Design System generator. Use when the user asks to create a design system,
  build a UI kit, set up design tokens, or create components in a Pencil .pen file
  for any business domain. Creates themed tokens, visual foundations, reusable
  components, and composition patterns.
---

# Pencil Design System Generator

Generate a complete design system in a Pencil `.pen` file. Research the business domain, create ~64 themed tokens (light + dark), build visual foundation documentation, ~25 reusable components, and 4 composition patterns.

## ⛔ GOLDEN RULES — Read These First

These rules prevent the #1 visual bug (overlapping elements). **Violating any of these produces a broken design.**

1. **EVERY frame MUST have `layout: "vertical"` or `layout: "horizontal"`.** No exceptions. Without it, children overlap at (0,0).
2. **Category display rows MUST use `layout: "horizontal"`.** Components shown side-by-side need a horizontal row frame.
3. **Use `height: "fit_content"` on section frames** — never fixed pixel heights.
4. **After EVERY `batch_design`, screenshot and CHECK for overlap.** Missing `layout` → add it immediately.
5. **Copy exact operation code from reference files.** Do NOT improvise layout code.
6. **NEVER call `open_document("new")`.** Always check `get_editor_state` first — if a `.pen` file exists, use it.

## Getting Started

1. **Parse the user's input** — extract domain, brand name, color preferences, font preferences, reference image
2. **Greet and confirm** — show what was understood and the build plan
3. **Execute phases** — pause at each review point for user approval (`c` continue, `r` redo, `s` skip)

## Workflow

Load reference files from `references/` as each phase begins.

### Phase 1 — Research the Domain
**If `collectui-mcp` is available:** Call `collectui_search({ query: "[domain]", limit: 8 })` first. Analyze returned design screenshots — extract dominant colors (hex), typography patterns, layout styles.

If a reference image exists (on canvas, in chat, or URL), analyze it first — extract colors (hex), typography style, tone, radii, shadows. This is the PRIMARY design source. Then search the web for the domain's color palettes, font pairings, and UI conventions. Compile a design brief. **Priority: reference image > Collect UI visual research > user preferences > web research.**

**REVIEW** — Show design brief. Wait for user input.

### Phase 2 — Initialize Pencil Document

**Step 1 — CHECK for existing document FIRST:**
Call `get_editor_state({ include_schema: true })`. Look at the `filePath` in the response.

**⛔ STOP AND DECIDE:**
- **If `filePath` contains ANY `.pen` file:** USE IT. Do NOT call `open_document`. The document is already open.
- **ONLY if `filePath` is empty/null:** Create: `open_document("./[domain]-design-system.pen")`.
- **NEVER call `open_document("new")`** — this creates a generic file that ignores the existing one.
- **NEVER call `open_document` if a `.pen` file is already open.**

**Step 2** — `get_guidelines({ topic: "design-system" })`
**Step 3** — `get_style_guide_tags()` then `get_style_guide({ tags: [...] })`
**Step 4** — `get_variables({ filePath })` — check for existing tokens

### Phase 3 — Create Design Tokens (~64)
Call `set_variables` with all tokens. CRITICAL — use this exact format:

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

CORRECT — non-color tokens: `{ "type": "number", "value": [{ "value": 6 }] }`

WRONG: `"theme": {}` (empty), `"themes"` key in variables, `"values"` (plural).

**Semantic colors MUST be derived from the primary palette** — match temperature, saturation, lightness. Do NOT use default Tailwind green/amber/red/blue. See `references/design-tokens-reference.md` for examples.

After `set_variables`, call `get_variables` — every color MUST show `"theme":{"mode":"light"}` and `"theme":{"mode":"dark"}`. If any show `"theme":{}`, redo.

See `references/design-tokens-reference.md` for full payload.

**REVIEW** — Show token count by category. Wait for user input.

### Phase 4 — Build Foundations
Foundations frame with `width: 1440, height: "fit_content", layout: "vertical", fill: "#FFFFFF"`. **Never use fixed heights** — use `height: "fit_content"`. Build: color palette, typography scale, spacing, elevation, border radius.

**Color Palette: Split into rows of max 5-6 swatches** to prevent horizontal overflow. Each swatch ~140-160px. Use a vertical container with multiple horizontal rows.

See `references/foundations-specs.md`.

**⚠ MANDATORY — Post-Batch Validation (after EVERY `batch_design` call in ALL phases):**
1. `get_screenshot` on the section just modified.
2. **STOP and analyze the screenshot.** Check for: overlapping/garbled text, stacked items that should be side-by-side, clipped content, invisible elements.
3. `snapshot_layout({ problemsOnly: true, parentId: "sectionId" })`.
4. **Fix ALL issues BEFORE continuing.** Missing `layout: "horizontal"` → add it. Garbled text → add `width: "fill_container"`.

**REVIEW** — Show screenshot. Wait for user input.

### Phase 5 — Build Components (~25)
Components frame with `width: 1440, height: "fit_content", layout: "vertical", fill: "#FFFFFF"`. Build ~25 reusable components in explicit batches. **Complete ALL batches — do NOT stop early.**

**⚠ CRITICAL STRUCTURE FOR EACH BATCH:**
1. Create a **category frame** (`layout: "vertical"`, `width: "fill_container"`) inside Components section
2. Add a category title text
3. Create a **display row** (`layout: "horizontal"`, `gap: 16`, `width: "fill_container"`) inside the category
4. Insert components into the display row — NOT directly into the Components section
5. **If elements overlap after batch_design, the parent frame is missing `layout` — fix immediately**

After EVERY batch, run the **Post-Batch Validation** above.

1. Buttons (5): Category (vertical) → Row (horizontal) → 5 buttons. Each: `layout: "horizontal"`. **Validate.**
2. Inputs (4): Category (vertical) → Row (horizontal) → 4 inputs. Each: `layout: "vertical"`. **Validate.**
3. Typography (6): Category (vertical) → 6 text components stacked. **Validate.**
4. Badges+Alerts (8): Category (vertical) → Badges row (horizontal) → Alerts row (vertical). **Validate.**
5. Card+Navigation (5): Category (vertical) → Row (horizontal). Card: `layout: "vertical"`. Sidebar: `layout: "vertical"`. **Validate.**
6. Table+Tabs+Breadcrumbs (9): Category (vertical) → sub-rows. Containers: `layout: "vertical"` or `"horizontal"`. **Validate.**
7. Remaining (10): Category (vertical) → display rows (horizontal) → components. **Validate.**

All components: `reusable: true`, `$--` tokens only. See `references/component-specs.md`.

**REVIEW** — Show component count and screenshot. Wait for user input.

### Phase 6 — Build Patterns
Patterns frame with `width: 1440, height: "fit_content", layout: "vertical"`. Build 4 showcases using component refs:
1. Form Pattern — `layout: "vertical"`, InputGroup refs + Submit
2. Data Display — Table + Pagination, stacked vertically
3. Navigation — horizontal: sidebar (`layout: "vertical"`, width: 240) + content (`layout: "vertical"`)
4. Card Layout — `layout: "horizontal"`, Card refs with `gap: 24`

**Every frame MUST have explicit `layout`.** Sidebars are ALWAYS `layout: "vertical"`.

**Images:** Use `G()` for domain visuals — card images: `G(frame, "stock", "[domain keyword]")`, avatars: `G(frame, "stock", "portrait")`. Insert frame first, then apply `G()`.

After each pattern, run the **Post-Batch Validation**.

See `references/screen-patterns.md`.

**REVIEW** — Show screenshot. Wait for user input.

### Phase 7 — Domain Screens (optional)
Only if user requests. Build 3-5 screens using component refs.

### Phase 8 — Verify + Fix
Layout enforcement, shadow fix, visual check, token audit, component audit.

See `references/verification-checklist.md`.

## Critical Rules

1. Always reuse components — search with `batch_get({ patterns: [{ reusable: true }] })` before creating
2. Never hardcode values — all colors use `$--` tokens
3. Prevent overflow — use `width: "fill_container"` and layout frames
4. Verify visually — `get_screenshot` after every major batch
5. Canvas organization — Foundations, Components, Patterns flow left-to-right

## References

- `references/pencil-mcp-guide.md` — Pencil MCP tool reference
- `references/domain-research-guide.md` — Research strategies, font pairings
- `references/design-tokens-reference.md` — Token architecture, ~64 definitions
- `references/foundations-specs.md` — Foundation documentation specs
- `references/component-specs.md` — Component batch_design code
- `references/screen-patterns.md` — Layout patterns, screen templates
- `references/verification-checklist.md` — QA checklist
- `references/code-export-guide.md` — Tailwind CSS export
