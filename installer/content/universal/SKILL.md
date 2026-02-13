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

## Getting Started

1. **Parse the user's input** — extract domain, brand name, color preferences, font preferences
2. **Greet and confirm** — show what was understood and the build plan
3. **Execute phases** — pause at each review point for user approval (`c` continue, `r` redo, `s` skip)

## Workflow

Load reference files from `references/` as each phase begins.

### Phase 1 — Research the Domain
Search the web for the domain's color palettes, font pairings, and UI conventions. Compile a design brief.

**REVIEW** — Show design brief. Wait for user input.

### Phase 2 — Initialize Pencil Document
1. `get_editor_state({ include_schema: true })` — if no document, `open_document("new")`
2. `get_guidelines({ topic: "design-system" })`
3. `get_style_guide_tags()` then `get_style_guide({ tags: [...] })`
4. `get_variables({ filePath })` — check for existing tokens

### Phase 3 — Create Design Tokens (~64)
Call `set_variables` with all tokens. CRITICAL: every variable needs `type`. Do NOT put `themes` in variables object — themes auto-register from `"theme": { "mode": "light" }` in value arrays.

See `references/design-tokens-reference.md` for full payload.

**REVIEW** — Show token count by category. Wait for user input.

### Phase 4 — Build Foundations
Foundations frame (1440x2400) with `fill: "#FFFFFF"`. Build: color palette, typography scale, spacing, elevation, border radius.

See `references/foundations-specs.md`.

**REVIEW** — Show screenshot. Wait for user input.

### Phase 5 — Build Components (~25)
Components frame (1440x2400). Build primitives (buttons, inputs, typography, badges, alerts) then composites (card, navigation, table, tabs, breadcrumbs, pagination, modal, dropdown, misc).

All components: `reusable: true`, `$--` tokens only. See `references/component-specs.md`.

**REVIEW** — Show component count and screenshot. Wait for user input.

### Phase 6 — Build Patterns
Patterns frame (1440x1800). Build 4 showcases using component refs: form, data display, navigation, card layout.

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
