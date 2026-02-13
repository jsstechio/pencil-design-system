# Pencil Design System Generator

Generate a complete, production-ready design system in a Pencil `.pen` file. In Claude Code, type `/pds coffee shop` and it builds everything conversationally. In other editors, use the step-by-step prompts.

## What it does

- Researches your business domain (color psychology, typography conventions, industry patterns)
- Creates ~64 themed design tokens (light + dark mode) with CSS custom properties
- Builds ~25 reusable components organized by category (Buttons, Inputs, Cards, Tables, Navigation, etc.)
- Generates visual foundation documentation (color palette, typography scale, spacing, elevation, radius)
- Creates 4 composition patterns showing real component usage
- Optionally builds domain-specific screens (login, dashboard, menu, etc.)
- Optionally exports to production-ready Tailwind CSS + React (v3 or v4, Next.js or Vite)

## Install

### Quick install (Claude Code + Antigravity)

```bash
npx skills add jsstechio/pencil-design-system-skill
```

This installs the skill to `.claude/skills/` (Claude Code) or `.agent/skills/` (Antigravity) — giving you the auto-detected skill. For the `/pds` **slash command** in Antigravity, also copy the workflow file:

```bash
npx skills add jsstechio/pencil-design-system-skill
git clone https://github.com/jsstechio/pencil-design-system-skill.git /tmp/pds-skill
cp -r /tmp/pds-skill/agent/workflows/ .agent/workflows/
cp -r /tmp/pds-skill/skills/references/ .agent/skills/pds/references/
rm -rf /tmp/pds-skill
```

### Manual install — Claude Code

```bash
git clone https://github.com/jsstechio/pencil-design-system-skill.git
cp -r pencil-design-system-skill/skills/ .claude/skills/
```

### Manual install — Google Antigravity

```bash
git clone https://github.com/jsstechio/pencil-design-system-skill.git
cp -r pencil-design-system-skill/agent/ .agent/
cp -r pencil-design-system-skill/skills/references/ .agent/skills/pds/references/
```

This installs both:
- **`/pds` workflow** (slash command) in `.agent/workflows/`
- **Auto-detected skill** in `.agent/skills/pds/`

Then type `/pds coffee shop` in the Antigravity chat.

### Other editors (Cursor, Windsurf, Cline)

No slash command support yet — use the [step-by-step prompts](#step-by-step-workflow) below. Connect the Pencil MCP server and paste prompts one at a time.

## Requirements

- [Pencil](https://pencil.js.org/) MCP server connected to your AI coding assistant
- Claude Code, Google Antigravity, Cursor, Windsurf, Cline, or any MCP-compatible editor

## Usage (Claude Code)

Type `/pds` followed by your business domain:

```
/pds coffee shop that sells coffee online
/pds SaaS analytics dashboard with dark blue and orange
/pds fitness app called "FitTrack" with teal and coral
/pds bakery called "Golden Crust" with Playfair Display heading font
```

The AI runs the full workflow conversationally — researching, building, and pausing at each phase for your review. Type `c` to continue, `r` to redo with changes, or `s` to skip ahead.

### Optional add-ons (during the flow)

- **Screens**: Say "add screens" when prompted, or include it upfront: `/pds bakery with screens`
- **Business logic screens**: At any review point, paste your requirements (PRD, user flows, feature specs)
- **Code export**: After completion, say "export to Tailwind v4 with Next.js"

---

## Using with Cursor, Windsurf, Antigravity, and other editors

The `/pds` slash command is **Claude Code only**. For other editors, use the step-by-step prompts below — paste one step at a time, verify, then paste the next.

### Editor setup

<details>
<summary><strong>Cursor</strong></summary>

Pencil auto-registers via its extension. Install the Pencil extension in Cursor, then verify it appears in **Settings > Features > MCP**.

If you need manual config, create `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` for global):

```json
{
  "mcpServers": {
    "pencil": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"]
    }
  }
}
```

**Limits:** 40 tools max across all MCP servers. Disable other MCP servers when doing Pencil work. Use Composer Agent mode for multi-step tasks.

**Tip:** Add a `.cursorrules` file with Pencil conventions to improve prompt adherence.
</details>

<details>
<summary><strong>Windsurf</strong></summary>

Enable MCP in **Settings > Advanced > Cascade > Model Context Protocol**. Install the Pencil extension.

Manual config path: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "pencil": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"]
    }
  }
}
```

**Limits:** 100 tools max. Supports stdio, SSE, and Streamable HTTP transports.

**Tip:** Cascade creates structured plans automatically — ask it to "plan first, then execute" for best results.
</details>

<details>
<summary><strong>Google Antigravity</strong></summary>

Antigravity is a VS Code fork — install the Pencil extension the same way as VS Code. Search "Pencil" in the Extensions panel or install manually:

```
antigravity --install-extension highagency.pencildev
```

The Pencil MCP server auto-registers when the extension is active. Verify it appears in the MCP servers panel.

If you need manual MCP config, click **Manage MCP Servers > View raw config** (`~/.gemini/antigravity/mcp_config.json`):

```json
{
  "mcpServers": {
    "pencil": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"]
    }
  }
}
```

**Note:** For HTTP-based MCP servers, Antigravity uses `serverUrl` (not `url`).

**`/pds` support:** If you installed the `agent/` directory (see [Install](#google-antigravity)), type `/pds coffee shop` in the chat to run the full workflow with review gates.
</details>

<details>
<summary><strong>Cline (VS Code extension)</strong></summary>

Open the MCP Servers icon in Cline's sidebar, go to Configure tab, and click "Configure MCP Servers":

```json
{
  "mcpServers": {
    "pencil": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"],
      "alwaysAllow": ["batch_design", "batch_get", "get_screenshot", "get_variables", "set_variables", "get_editor_state", "open_document", "get_guidelines", "get_style_guide", "get_style_guide_tags", "snapshot_layout", "find_empty_space_on_canvas"],
      "disabled": false
    }
  }
}
```

**Tip:** Set `alwaysAllow` for Pencil tools to avoid repeated permission prompts during the workflow. Increase network timeout to 5 minutes for complex `batch_design` calls.
</details>

<details>
<summary><strong>VS Code + GitHub Copilot</strong></summary>

Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "pencil": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"]
    }
  }
}
```

Or use Command Palette: `MCP: Add Server`.
</details>

<details>
<summary><strong>Continue (VS Code / JetBrains)</strong></summary>

Add to `.continue/config.yaml`:

```yaml
mcpServers:
  - name: pencil
    command: npx
    args:
      - -y
      - "@anthropic-ai/pencil-mcp"
```
</details>

<details>
<summary><strong>Zed</strong></summary>

Add to Zed's `settings.json` (note: Zed uses `context_servers`, not `mcpServers`):

```json
{
  "context_servers": {
    "pencil": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/pencil-mcp"]
    }
  }
}
```
</details>

> **Note:** In most editors, Pencil auto-registers its MCP server through its extension/app — you may not need manual config. Just install the Pencil extension, ensure Pencil is running, and check your editor's MCP panel.

### Critical: `set_variables` format

The most common error when using this outside Claude Code is the `set_variables` call. Here's what you need to know:

**DO NOT put `"themes"` inside the `variables` object.** Themes are auto-registered when you use `"theme": { "mode": "light" }` in value arrays.

```
WRONG — causes "Variable 'themes' is missing its 'type' property!":
set_variables({
  filePath: "file.pen",
  variables: {
    "themes": { "mode": ["light", "dark"] },    // <-- DO NOT DO THIS
    "--primary": { "type": "color", "value": [...] }
  }
})

CORRECT — themes auto-register from usage:
set_variables({
  filePath: "file.pen",
  variables: {
    "--primary": {
      "type": "color",
      "value": [
        { "value": "#8B4513", "theme": { "mode": "light" } },
        { "value": "#D4A574", "theme": { "mode": "dark" } }
      ]
    },
    "--font-primary": {
      "type": "string",
      "value": "Playfair Display"
    },
    "--radius-md": {
      "type": "number",
      "value": 8
    }
  }
})
```

**Rules:**
- Every variable needs a `"type"` — `"color"`, `"string"`, or `"number"`
- Themed variables use `"value": [{ "value": "#hex", "theme": { "mode": "light" } }, ...]` (array)
- Non-themed variables use `"value": "some string"` or `"value": 8` (plain value)
- The `"theme": { "mode": "light" }` entries auto-create the `mode` theme axis with `light`/`dark` values
- Use `"value"` (singular), never `"values"`

### Step-by-step workflow

Run these steps one at a time. Each step is self-contained — paste it, let the AI execute, verify the result, then paste the next step. Replace `[YOUR DOMAIN]` before pasting.

```
Step 1: Research + Initialize     → design brief, .pen file ready
         ↓ you verify ↓
Step 2: Design Tokens             → ~64 themed tokens (light + dark)
         ↓ you verify ↓
Step 3: Foundations                → visual documentation frame
         ↓ you verify ↓
Step 4: Components                → ~25 reusable components
         ↓ you verify ↓
Step 5: Patterns                  → 4 composition showcases
         ↓ you verify ↓
Step 6: Domain Screens (optional) → 3-5 generic domain screens
         ↓ you verify ↓
Step 7: Business Logic Screens    → screens from YOUR requirements
  (optional)
         ↓ you verify ↓
Step 8: Verify + Fix              → clean, verified system
```

---

### Step 1: Research + Initialize

> **Prerequisite:** None | **Creates:** Design brief + .pen file ready

```
You are building a design system for [YOUR DOMAIN] in a Pencil .pen file.

1. Call get_editor_state({ include_schema: true }). If no document is active,
   call open_document("new").
2. Call get_guidelines("design-system").
3. Call get_style_guide_tags(), then get_style_guide with 5-10 tags matching
   [YOUR DOMAIN].
4. Search the web for design conventions for [YOUR DOMAIN]:
   - Color palettes used by real [YOUR DOMAIN] websites
   - Font pairings (search "[YOUR DOMAIN] website fonts 2026")
   - UI tone and density
5. Compile a design brief listing: primary color, secondary color, accent color,
   background color, heading font, body font, and overall tone.

STOP HERE. Show me the design brief. Do NOT proceed to tokens.
```

---

### Step 2: Design Tokens

> **Prerequisite:** Step 1 | **Creates:** ~64 themed variables (light + dark mode)

```
Read the current .pen file with get_editor_state. Load get_guidelines("design-system").

Use set_variables to create ~64 themed design tokens based on the design brief
from the previous step. Use [YOUR DOMAIN] appropriate colors and fonts.

CRITICAL FORMAT — every variable needs a "type" property. Do NOT include a
"themes" key in the variables object. Themes auto-register from usage.

Themed color format:
  "--primary": {
    "type": "color",
    "value": [
      { "value": "#HEX", "theme": { "mode": "light" } },
      { "value": "#HEX", "theme": { "mode": "dark" } }
    ]
  }

Non-themed format:
  "--radius-md": { "type": "number", "value": 8 }
  "--font-primary": { "type": "string", "value": "Font Name" }

Create ALL of these token categories:
- 19 core colors: background, foreground, card, card-foreground, popover,
  popover-foreground, primary, primary-foreground, secondary, secondary-foreground,
  muted, muted-foreground, accent, accent-foreground, destructive,
  destructive-foreground, border, input, ring
- 8 semantic colors: success, warning, error, info (each with foreground)
- 3 fonts: font-primary (string), font-secondary (string), font-mono (string)
- 6 radii: radius-none(0), radius-sm(4), radius-md(8), radius-lg(12),
  radius-xl(16), radius-pill(9999)
- 12 spacing: space-1(4) through space-24(96)
- 4 shadows: shadow-sm, shadow-md, shadow-lg, shadow-xl (string type)
- 9 font sizes: text-xs(12) through text-5xl(48)
- 3 line heights: leading-tight(1.25), leading-normal(1.5), leading-relaxed(1.75)

After set_variables, call get_variables and verify:
- Total token count (~64)
- Every color token has 2 value entries (light + dark)

STOP HERE. Report the token count by category. Do NOT proceed to foundations.
```

---

### Step 3: Foundations

> **Prerequisite:** Step 2 | **Creates:** Visual documentation frame (1440x2400)

```
Read the .pen file state with get_editor_state and get_variables.

Create a Foundations section frame at position x:0, y:0, size 1440x2400,
with fill "#FFFFFF" (neutral white — NOT the $--background token, so all
swatches are visible against a known reference).

Inside it, build 5 documentation frames:
1. Color Palette — grid of labeled swatches for all 27 color tokens, each
   showing the token name and hex value as a label
2. Typography Scale — 6 specimens (H1-H3, Body, Caption, Label) at real sizes
   using $--font-primary and $--font-secondary
3. Spacing Scale — 12 visual blocks showing each $--space-* value with labels
4. Elevation — 4 cards showing shadow levels (use effect property with 8-digit
   hex colors like #0000000D, NOT rgba)
5. Border Radius — 6 rectangles showing each $--radius-* token

Use batch_design with max 25 operations per call. All swatches use $-- token
references for fills. After each batch, call get_screenshot to verify.

STOP HERE. Show me screenshot(s) of the Foundations frame. Do NOT proceed to components.
```

---

### Step 4: Components

> **Prerequisite:** Step 3 | **Creates:** ~25 reusable components (1440x2400)

```
Read the .pen file with get_editor_state and get_variables. Call
get_guidelines("design-system") if not already loaded.

Create a Components section frame at x:1540, y:0, size 1440x2400,
fill "#FFFFFF" (neutral white backdrop).

Build ~25 reusable components organized by category. Use batch_design with
max 25 operations per call. ALL components must have reusable: true and use
$-- token references (never hardcoded colors).

Category batches:
- Batch 1: Buttons — Primary, Secondary, Outline, Ghost, Destructive (5)
- Batch 2: Inputs — TextField, Textarea, Select, InputGroup (4)
- Batch 3: Typography — H1, H2, H3, Body, Caption, Label (6)
- Batch 4: Badges — Default, Success, Warning, Error (4)
- Batch 5: Alerts — Info, Success, Warning, Error (4)
- Batch 6: Card — Header + Content + Actions slots (1)
- Batch 7: Navigation — Sidebar, ActiveItem, DefaultItem, SectionTitle (4)
- Batch 8: Table — Wrapper, HeaderRow, DataRow (3)
- Batch 9: Tabs, Breadcrumbs, Pagination (~10)
- Batch 10: Modal, Dropdown, Misc (Avatar, Divider, Switch, Checkbox, Radio) (~10)

After EVERY batch: check response for warnings, call get_screenshot, verify
no overlapping elements. If horizontal items are stacked, the frame is missing
layout: "horizontal" — fix before next batch.

After all batches: call batch_get({ patterns: [{ reusable: true }] }) and
count components.

STOP HERE. Report component count by category and show screenshot(s).
Do NOT proceed to patterns.
```

---

### Step 5: Patterns

> **Prerequisite:** Step 4 | **Creates:** 4 composition showcases (1440x1800)

```
Read the .pen file with get_editor_state. Read existing components with
batch_get({ patterns: [{ reusable: true }], readDepth: 2 }).

Create a Patterns section frame at x:3080, y:0, size 1440x1800,
fill "#FFFFFF".

Build 4 composition patterns using ONLY component ref instances and $-- tokens:
1. Form Pattern — vertical stack of InputGroup refs + Submit button ref
2. Data Display — Table ref with populated rows + Pagination ref
3. Navigation Pattern — Sidebar ref + Breadcrumbs ref + Tabs ref
4. Card Layout — grid of Card refs with realistic [YOUR DOMAIN] content

Use batch_design with max 25 operations per call. After each pattern,
call get_screenshot and verify layout.

STOP HERE. Show screenshot(s) of all 4 patterns. Do NOT proceed.
```

---

### Step 6: Domain Screens (optional)

> **Prerequisite:** Step 5 | **Creates:** 3-5 generic domain screens

```
Read the .pen file with get_editor_state. Read components with
batch_get({ patterns: [{ reusable: true }], readDepth: 2 }) and tokens with
get_variables.

Build 3-5 domain-appropriate screens for [YOUR DOMAIN]. For each screen:
1. Call find_empty_space_on_canvas({ direction: "right", width: 1440,
   height: 900, padding: 100 })
2. Insert screen frame at returned position
3. Build layout using existing component refs
4. Customize content with realistic [YOUR DOMAIN] data
5. Add domain imagery via G() where appropriate
6. Call get_screenshot to verify

Example screens for common domains:
- Bakery: Landing, Menu, Item Detail, Cart, About
- SaaS: Dashboard, Settings, Pricing, Login, Analytics
- Fitness: Home, Workout Detail, Progress, Profile, Schedule

STOP HERE. Show screenshot of each screen. Do NOT proceed.
```

---

### Step 7: Business Logic Screens (optional)

> **Prerequisite:** Step 5 or 6 | **Creates:** Screens tailored to YOUR specific requirements

Paste your product requirements along with this prompt:

```
Read the .pen file with get_editor_state. Read components with
batch_get({ patterns: [{ reusable: true }], readDepth: 2 }) and tokens with
get_variables.

Based on the following business requirements, plan and build the screens needed.
Map each user flow or feature to a screen. Use existing reusable components via
refs. Use batch_design with max 25 operations per call.

For each screen:
1. find_empty_space_on_canvas({ direction: "right", width: 1440, height: 900,
   padding: 100 })
2. Insert screen frame, build layout with component refs
3. Add realistic content matching the business requirements
4. get_screenshot to verify

MY REQUIREMENTS:
[PASTE YOUR USER FLOWS, FEATURE SPECS, PRD, OR WIREFRAME DESCRIPTIONS HERE]

STOP HERE. Show me each screen with a description of how it maps to my
requirements. Do NOT proceed.
```

---

### Step 8: Verify + Fix

> **Prerequisite:** All previous steps | **Creates:** Clean, verified system

```
Read the .pen file with get_editor_state.

Run a full verification pass:

1. LAYOUT ENFORCEMENT — Find all frames with gap/alignItems/justifyContent
   properties. Ensure each has an explicit layout ("horizontal" or "vertical").
   batch_get({ patterns: [{ type: "frame" }], searchDepth: 10, readDepth: 0 })
   then Update any frame missing layout.

2. SHADOW FIX — Check all frames with effect property. Replace any rgba()
   shadow colors with 8-digit hex (#RRGGBBAA). Common: 5%=#0D, 7%=#12,
   10%=#1A, 15%=#26.

3. VISUAL CHECK — get_screenshot on Foundations, Components, Patterns, and
   each screen. Check alignment, spacing, overflow.

4. LAYOUT CHECK — snapshot_layout({ problemsOnly: true }). Fix any
   clipping/overflow issues.

5. TOKEN AUDIT — search_all_unique_properties for fillColor, textColor,
   fontFamily, fontSize. Replace any leaked hex values or raw font names
   with $-- token references.

6. COMPONENT AUDIT — batch_get({ patterns: [{ reusable: true }] }). Verify
   ~25 components exist, all under Components section (none at document root).

7. RE-VERIFY — Re-screenshot any sections that were fixed.

Report: total tokens, total components, sections created, any remaining issues.
Show final screenshots.
```

---

### Bonus: Code Export (optional)

```
Read tokens with get_variables and components with batch_get({ patterns:
[{ reusable: true }], readDepth: 3 }). Call get_guidelines("code") and
get_guidelines("tailwind").

Export to Tailwind CSS v4 + React:
1. globals.css — @import "tailwindcss", @custom-variant dark, :root with
   all tokens as CSS custom properties (hex values), .dark overrides
2. React components — one file per category (button.tsx, input.tsx, card.tsx,
   etc.), using Tailwind classes with var(--token) syntax
3. layout.tsx — next/font/google loader for all 3 fonts, CSS variable setup

Write all files to the project directory.
```

### Tips

- **One step at a time** — paste one step, verify, then the next. Don't combine steps.
- **Cursor users** — disable unneeded MCP servers to stay under the 40-tool limit
- **Windsurf users** — ask Cascade to "plan first" for multi-step phases
- **Cline users** — set network timeout to 5 min, pre-approve Pencil tools via `alwaysAllow`
- **Antigravity users** — install the Pencil extension from the Extensions panel, same as VS Code

---

## Example: Coffee shop design system

### Claude Code (`/pds` command)

```
> /pds coffee shop that sells coffee online
```

The AI responds conversationally:

```
Pencil Design System Generator

Domain: Coffee shop (online sales)
Brand:  unnamed
Colors: will research
Fonts:  will research

I'll build this step by step:
 1. Research    -> design brief
 2. Tokens      -> ~64 themed variables (light + dark)
 3. Foundations  -> visual documentation
 4. Components  -> ~25 reusable parts
 5. Patterns    -> 4 composition showcases

Starting with domain research...
```

After researching, it pauses:

```
Design Brief — Coffee Shop

Primary:    #3E2723 (rich espresso brown)
Secondary:  #EFEBE9 (warm cream)
Accent:     #E65100 (burnt orange)
Background: #F5F0EB (warm linen)
Heading:    DM Serif Display
Body:       Inter
Tone:       Warm, artisanal, inviting

[c] Continue to token creation
[r] Redo — tell me what to change
[s] Skip to final verification
```

Type `c` to continue. At each phase, it builds, shows results (with screenshots), and waits:

```
Tokens Created — 64 total

| Category        | Count | Status     |
|-----------------|-------|------------|
| Core colors     | 19    | light+dark |
| Semantic colors | 8     | light+dark |
| Typography      | 3     |            |
| Border radius   | 6     |            |
| Spacing         | 12    |            |
| Shadows         | 4     |            |
| Font sizes      | 9     |            |
| Line heights    | 3     |            |

[c] Continue to Foundations
[r] Redo — tell me what to change
[s] Skip to final verification
```

This continues through foundations, components, and patterns. At any review point you can:
- Type `c` to continue
- Type `r` and describe changes (e.g., "use teal instead of brown")
- Type `s` to skip to final verification
- Paste business requirements to add custom screens

### Other editors (Cursor, Windsurf, Antigravity, Cline)

Use the step-by-step prompts above. Paste Step 1, verify, paste Step 2, verify, etc. The workflow is the same — you just trigger each phase manually instead of typing `/pds`.

### Result

You end up with a complete `.pen` file:
- 64 themed tokens (light + dark)
- Visual documentation (foundations)
- 25 reusable components
- 4 composition patterns
- Optional: domain screens + business logic screens

All version-controlled in Git. Export to Tailwind + React with the bonus code export step.

---

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
