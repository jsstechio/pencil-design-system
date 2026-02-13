# Pencil Design System Generator

Generate a complete, production-ready design system in a Pencil `.pen` file from a single prompt like "build a design system for a bakery."

## What it does

- Researches your business domain (color psychology, typography conventions, industry patterns)
- Creates ~64 themed design tokens (light + dark mode) with CSS custom properties
- Builds ~25 reusable components organized by category (Buttons, Inputs, Cards, Tables, Navigation, etc.)
- Generates visual foundation documentation (color palette, typography scale, spacing, elevation, radius)
- Creates 4 composition patterns showing real component usage
- Optionally builds domain-specific screens (login, dashboard, menu, etc.)
- Optionally exports to production-ready Tailwind CSS + React (v3 or v4, Next.js or Vite)

## Install (Claude Code)

```bash
npx skills add jsstechio/pencil-design-system-skill
```

### Manual install

Copy the `skills/` directory into your project's `.claude/skills/` folder:

```bash
git clone https://github.com/jsstechio/pencil-design-system-skill.git
cp -r pencil-design-system-skill/skills/ .claude/skills/
```

## Requirements

- [Pencil](https://pencil.js.org/) MCP server connected to your AI coding assistant
- Claude Code CLI, Cursor, Windsurf, or any MCP-compatible editor

## Usage

Just tell Claude what you need:

```
> Create a design system for a bakery called "Golden Crust"
> Build a design system for a SaaS analytics dashboard
> Create a UI kit for a fitness app with dark teal and coral colors
```

The skill handles everything: domain research, token creation, component building, documentation, and verification.

### Optional phases

- **Screens**: "Build screens for a bakery" (adds 3-5 domain screens)
- **Code export**: "Export to Tailwind v4 with Next.js" (generates globals.css, components, layout.tsx)

---

## Using with Cursor, Windsurf, and other AI editors

The skill file is built for Claude Code, but you can use the Pencil MCP server with **any MCP-compatible AI editor**. Just connect the Pencil MCP server and paste one of the prompts below.

### Setup

1. Add the Pencil MCP server to your editor's MCP configuration
2. Open a new Pencil `.pen` file (or have the AI create one)
3. Paste one of the prompts below into the chat

### Full design system prompt

Copy and paste this prompt into **Cursor**, **Windsurf (Antigravity)**, or any AI editor with Pencil MCP connected:

```
Create a complete design system in a Pencil .pen file for [YOUR BUSINESS/DOMAIN].

Follow these steps in order:

1. RESEARCH: Search the web for design conventions, color psychology, and typography
   trends for [YOUR DOMAIN]. Identify a color palette (primary, secondary, accent,
   background, foreground, muted), a font pairing (heading + body), and the overall
   tone (clean, bold, playful, etc.).

2. INITIALIZE: Call get_editor_state, open a new document if needed, call
   get_guidelines("design-system"), then get_style_guide_tags and get_style_guide
   with 5-10 relevant tags.

3. TOKENS: Use set_variables to create ~60 themed design tokens with light and dark
   modes. Include: primary, secondary, accent, background, foreground, muted, card,
   popover, border, ring, destructive — each with DEFAULT and foreground variants.
   Also add radius (sm/md/lg/xl), spacing scale, font families, and font sizes.

4. FOUNDATIONS FRAME (1440x2400): Create visual documentation showing:
   - Color palette swatches (all tokens with hex values)
   - Typography specimens (heading + body at multiple sizes)
   - Spacing scale visualization
   - Elevation/shadow examples
   - Border radius showcase

5. COMPONENTS FRAME (1440x2400): Build ~25 reusable components using batch_design,
   organized by category:
   - Buttons (primary, secondary, outline, ghost, destructive, icon, loading)
   - Inputs (text, textarea, select, checkbox, radio, toggle, search)
   - Typography (h1-h4, body, caption, overline)
   - Feedback (badge, alert variants, tooltip, progress bar)
   - Cards (basic, stat card, profile card, pricing card)
   - Navigation (navbar, sidebar, tabs, breadcrumb, pagination)
   - Data (table with header + rows, list items)
   - Overlay (modal, dropdown menu, toast notification)
   All components must use token variables (not hardcoded colors), have
   reusable: true, and use proper layout (vertical/horizontal with gap/padding).

6. PATTERNS FRAME (1440x1800): Create 4 composition patterns using component refs:
   - Form pattern (labels + inputs + button)
   - Data display (table or stat cards)
   - Navigation pattern (navbar + sidebar + content)
   - Card layout (grid of cards)

7. VERIFY: Take screenshots of each section with get_screenshot and fix any visual
   issues (overlapping, clipping, misalignment, hardcoded colors).

Business domain: [REPLACE WITH YOUR DOMAIN, e.g., "bakery", "SaaS dashboard", "fitness app"]
Brand name: [OPTIONAL - REPLACE OR REMOVE]
Color preferences: [OPTIONAL - e.g., "dark teal and coral"]
```

### Quick prompts for specific tasks

**Generate just tokens and foundations:**
```
Connect to Pencil MCP. Create a new .pen document. Research the [YOUR DOMAIN] industry
for design conventions, then use set_variables to create ~60 themed tokens (light + dark
mode) covering colors, typography, spacing, radius, and shadows. Build a 1440x2400
Foundations frame with color swatches, typography specimens, spacing scale, elevation
examples, and border radius showcase. Use get_screenshot to verify.
```

**Add components to an existing design system:**
```
Read the current .pen file's variables with get_variables. Using those tokens, build ~25
reusable components in a 1440x2400 Components frame: buttons (primary, secondary, outline,
ghost, destructive), inputs (text, select, checkbox, toggle), typography (h1-h4, body),
badges, alerts, cards (basic, stat, profile, pricing), navbar, sidebar, tabs, breadcrumb,
pagination, table, modal, dropdown, and toast. All components must be reusable: true and
use variable references for colors. Verify with get_screenshot.
```

**Build domain screens:**
```
Read the existing .pen file's components and variables. Create 3-5 domain-specific screens
for a [YOUR DOMAIN] app to the right of existing content. Each screen should be 1440x900,
use the existing reusable components via refs, and include realistic content. Example
screens: login/signup, dashboard/home, [domain-specific page], settings. Verify each screen
with get_screenshot.
```

**Export to code:**
```
Read the current .pen file's variables with get_variables and components with batch_get.
Export to Tailwind CSS v4 + React:
1. Generate globals.css with @theme containing all CSS custom properties from the tokens
2. Create React components matching each Pencil component (use className with Tailwind)
3. Generate a layout.tsx with font imports and theme provider
Write all files to the project directory.
```

## What's included

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill with 11-phase workflow |
| `references/domain-research-guide.md` | Domain research strategies, color psychology, font pairings |
| `references/design-tokens-reference.md` | Token architecture, ~60 token definitions, industry palettes |
| `references/foundations-specs.md` | Visual documentation specs (color, typography, spacing, elevation, radius) |
| `references/component-specs.md` | All ~25 component batch_design operation code |
| `references/screen-patterns.md` | Layout patterns, composition showcases, domain screen templates |
| `references/verification-checklist.md` | Visual QA, layout checks, token audits |
| `references/code-export-guide.md` | Tailwind CSS export (v3/v4), component translation, framework setup |
| `references/pencil-mcp-guide.md` | Pencil MCP tool reference |

## License

MIT
