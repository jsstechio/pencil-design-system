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

## Install

```bash
npx skills add jsstech/pencil-design-system
```

### Manual install

Copy the `skills/` directory into your project's `.claude/skills/` folder:

```bash
git clone https://github.com/jsstech/pencil-design-system.git
cp -r pencil-design-system/skills/ .claude/skills/
```

## Requirements

- [Pencil](https://pencil.js.org/) MCP server connected to Claude Code
- Claude Code CLI

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
