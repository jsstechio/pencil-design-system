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
<summary><strong>Windsurf / Antigravity</strong></summary>

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

### Full design system prompt

Copy and paste this into **Cursor**, **Windsurf**, **Cline**, or any AI editor with Pencil MCP:

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
   modes. CRITICAL FORMAT — every variable must have a "type" property. Themed color
   variables use an array of values with theme objects. Do NOT include a "themes" key
   in the variables object. Example:
   set_variables({
     filePath: "file.pen",
     variables: {
       "--primary": {
         "type": "color",
         "value": [
           { "value": "#HEX", "theme": { "mode": "light" } },
           { "value": "#HEX", "theme": { "mode": "dark" } }
         ]
       },
       "--font-primary": { "type": "string", "value": "Font Name" },
       "--radius-md": { "type": "number", "value": 8 }
     }
   })
   Include tokens for: primary, secondary, accent, background, foreground, muted,
   card, popover, border, ring, destructive (each with DEFAULT and foreground
   variants), plus radius (sm/md/lg/xl), spacing scale, font families, font sizes,
   line heights, and shadows.

4. FOUNDATIONS FRAME (1440x2400): Create visual documentation showing:
   - Color palette swatches (all tokens with hex values)
   - Typography specimens (heading + body at multiple sizes)
   - Spacing scale visualization
   - Elevation/shadow examples
   - Border radius showcase

5. COMPONENTS FRAME (1440x2400): Build ~25 reusable components using batch_design
   (max 25 operations per call), organized by category:
   - Buttons (primary, secondary, outline, ghost, destructive, icon, loading)
   - Inputs (text, textarea, select, checkbox, radio, toggle, search)
   - Typography (h1-h4, body, caption, overline)
   - Feedback (badge, alert variants, tooltip, progress bar)
   - Cards (basic, stat card, profile card, pricing card)
   - Navigation (navbar, sidebar, tabs, breadcrumb, pagination)
   - Data (table with header + rows, list items)
   - Overlay (modal, dropdown menu, toast notification)
   All components must use $-- token variable references (not hardcoded colors),
   have reusable: true, and use proper layout (vertical/horizontal with gap/padding).

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
Connect to Pencil MCP. Call get_editor_state, create a new .pen document if needed.
Research the [YOUR DOMAIN] industry for design conventions.

Use set_variables to create ~60 themed tokens. IMPORTANT: Do NOT put a "themes" key
inside variables. Each variable needs a "type" property. Themed colors use:
  "--name": { "type": "color", "value": [
    { "value": "#hex", "theme": { "mode": "light" } },
    { "value": "#hex", "theme": { "mode": "dark" } }
  ]}
Non-themed values use: "--name": { "type": "number", "value": 8 }

Create tokens for: 19 core colors, 8 semantic colors, 3 fonts (string type),
6 radii, 12 spacing, 4 shadows (string type), 9 font sizes, 3 line heights.

Build a 1440x2400 Foundations frame with color swatches, typography specimens,
spacing scale, elevation examples, and border radius showcase.
Use get_screenshot to verify.
```

**Add components to an existing design system:**
```
Read the current .pen file's variables with get_variables. Using those tokens, build ~25
reusable components in a 1440x2400 Components frame. Use batch_design with max 25
operations per call. Components: buttons (primary, secondary, outline, ghost, destructive),
inputs (text, select, checkbox, toggle), typography (h1-h4, body), badges, alerts, cards
(basic, stat, profile, pricing), navbar, sidebar, tabs, breadcrumb, pagination, table,
modal, dropdown, and toast. All components must be reusable: true and reference tokens
with $-- prefix for all colors. Verify with get_screenshot.
```

**Build domain screens:**
```
Read the existing .pen file's components and variables. Create 3-5 domain-specific screens
for a [YOUR DOMAIN] app to the right of existing content. Use find_empty_space_on_canvas
to position them. Each screen should be 1440x900, use the existing reusable components via
refs, and include realistic content. Example screens: login/signup, dashboard/home,
[domain-specific page], settings. Verify each screen with get_screenshot.
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

### Tips for best results

- **Be specific in prompts** — "button with 16px padding and #3B82F6 fill" beats "make a nice button"
- **Phase your workflow** — don't ask for everything in one prompt. Do tokens first, verify, then components, verify, then screens
- **Always verify visually** — end every phase with `get_screenshot` calls
- **Read guidelines first** — always call `get_guidelines("design-system")` before creating anything
- **Limit batch sizes** — keep `batch_design` calls to 25 operations max for reliability
- **Cursor users** — disable unneeded MCP servers to stay under the 40-tool limit
- **Windsurf users** — ask Cascade to "plan first" for complex multi-step workflows
- **Cline users** — set network timeout to 5 minutes and pre-approve Pencil tools with `alwaysAllow`

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
