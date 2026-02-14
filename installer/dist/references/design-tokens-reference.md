# Design Tokens Reference

Complete token architecture and `set_variables` patterns for building domain-tailored design systems. Load this file during Phase 3.

## Token Architecture

The token system follows shadcn/ui conventions adapted for Pencil, expanded with spacing, shadow, font-size, and line-height tokens. Every visual property is a variable. Components reference tokens with `$--` prefix (e.g., `$--primary`).

### Architecture Layers

```
1. Primitive tokens    → Raw values (hex colors, font names, pixel numbers)
2. Semantic tokens     → Named roles ($--primary, $--background, $--destructive)
3. Utility tokens      → Spacing, shadows, font sizes, line heights
4. Component tokens    → Applied in components via $-- references
5. Theme axis          → Light/dark mode switches between value sets
```

---

## Theme Axis Setup

Define a single theme axis `mode` with values `light` and `dark`:

```json
{
  "mode": ["light", "dark"]
}
```

Variables that support theming use the `value` property with an **array** of `{ value, theme }` objects. Variables that are theme-independent use `value` with a simple string/number.

> **CRITICAL — Theme Format:** You MUST use the array format with the `value` property (singular, NOT `values`):
> ```json
> "--background": {
>   "type": "color",
>   "value": [
>     { "value": "#FAFAFA", "theme": { "mode": "light" } },
>     { "value": "#0A0A0A", "theme": { "mode": "dark" } }
>   ]
> }
> ```
> Do NOT use `"values": { "mode:light": "#hex" }` — this causes an error.
> Do NOT use `[{ "value": "#hex" }, { "value": "#hex" }]` without `theme` — this creates unthemed values.
>
> **Verification:** After `set_variables`, call `get_variables` and check that each color token has exactly **2** value entries (matching the light/dark axis). Note: `get_variables` always displays `"theme":{}` — this is normal. Themes are matched by array position to the `themes.mode` order.

---

## Complete Token Definitions

### Core Color Tokens

These 19 tokens form the color foundation. Every component uses only these tokens.

| Token | Role | Light Default | Dark Default |
|-------|------|--------------|-------------|
| `--background` | Page/app background | Domain light | Domain dark |
| `--foreground` | Default text on background | Near-black | Near-white |
| `--card` | Card/panel surface | White or slightly tinted | Slightly lighter than background |
| `--card-foreground` | Text on cards | Near-black | Near-white |
| `--popover` | Popover/dropdown surface | White | Dark gray |
| `--popover-foreground` | Text in popovers | Near-black | Near-white |
| `--primary` | Primary brand color | Domain primary | Domain primary (lighter) |
| `--primary-foreground` | Text on primary | White or contrast | White or contrast |
| `--secondary` | Secondary surfaces/buttons | Light gray or tinted | Dark gray |
| `--secondary-foreground` | Text on secondary | Dark text | Light text |
| `--muted` | Muted backgrounds, disabled | Very light gray | Very dark gray |
| `--muted-foreground` | Muted text, placeholders | Medium gray | Medium gray |
| `--accent` | Accent highlights, hover | Domain accent (light) | Domain accent (dark) |
| `--accent-foreground` | Text on accent | Dark text | Light text |
| `--destructive` | Error/danger actions | Red | Red (lighter) |
| `--destructive-foreground` | Text on destructive | White | White |
| `--border` | Default borders | Light gray | Dark gray |
| `--input` | Input field borders | Light gray | Dark gray |
| `--ring` | Focus ring color | Primary with opacity | Primary with opacity |

### Semantic Color Tokens

| Token | Role | Light | Dark |
|-------|------|-------|------|
| `--color-success` | Success state | `#22C55E` | `#4ADE80` |
| `--color-success-foreground` | Text on success | `#FFFFFF` | `#052E16` |
| `--color-warning` | Warning state | `#F59E0B` | `#FBBF24` |
| `--color-warning-foreground` | Text on warning | `#FFFFFF` | `#451A03` |
| `--color-error` | Error state | `#EF4444` | `#F87171` |
| `--color-error-foreground` | Text on error | `#FFFFFF` | `#450A0A` |
| `--color-info` | Info state | `#3B82F6` | `#60A5FA` |
| `--color-info-foreground` | Text on info | `#FFFFFF` | `#172554` |

### Typography Tokens

> **Important:** Font variables use `type: "string"`, NOT `"font"` (which doesn't exist in Pencil). They render correctly but will show a benign "invalid" warning — safe to ignore.

| Token | Type | Description |
|-------|------|-------------|
| `--font-primary` | `string` | Display/heading font — research-validated, domain-specific |
| `--font-secondary` | `string` | Body/UI font — research-validated, domain-specific |
| `--font-mono` | `string` | Code/data font — always JetBrains Mono |

### Border Radius Tokens

| Token | Type | Value |
|-------|------|-------|
| `--radius-none` | `number` | `0` |
| `--radius-sm` | `number` | `4` |
| `--radius-md` | `number` | `8` |
| `--radius-lg` | `number` | `12` |
| `--radius-xl` | `number` | `16` |
| `--radius-pill` | `number` | `9999` |

### Spacing Tokens

A consistent spacing scale based on a 4px base unit. Use these for padding, gap, and margin values.

| Token | Type | Value (px) | Use Case |
|-------|------|-----------|----------|
| `--space-1` | `number` | `4` | Tight gaps (icon-to-text, badge padding) |
| `--space-2` | `number` | `8` | Compact spacing (list items, small buttons) |
| `--space-3` | `number` | `12` | Standard inner padding |
| `--space-4` | `number` | `16` | Default content padding |
| `--space-5` | `number` | `20` | Comfortable padding |
| `--space-6` | `number` | `24` | Section inner spacing |
| `--space-8` | `number` | `32` | Card/panel padding |
| `--space-10` | `number` | `40` | Section gaps |
| `--space-12` | `number` | `48` | Large section gaps |
| `--space-16` | `number` | `64` | Page section spacing |
| `--space-20` | `number` | `80` | Page horizontal padding |
| `--space-24` | `number` | `96` | Hero/banner vertical padding |

### Shadow Tokens

Box shadow values for elevation. Use these to create visual depth hierarchy.

| Token | Type | Value | Use Case |
|-------|------|-------|----------|
| `--shadow-sm` | `string` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift (cards, inputs) |
| `--shadow-md` | `string` | `0 4px 6px rgba(0,0,0,0.07)` | Default elevation (dropdowns, popovers) |
| `--shadow-lg` | `string` | `0 10px 15px rgba(0,0,0,0.1)` | Prominent elevation (modals, dialogs) |
| `--shadow-xl` | `string` | `0 20px 25px rgba(0,0,0,0.15)` | Highest elevation (floating panels) |

> **IMPORTANT — Shadows in Pencil vs Code:**
> - Shadow tokens are stored as `type: "string"` — they hold CSS shadow notation for code export only.
> - Pencil does NOT have a `shadow` property on nodes. To apply shadows visually in `.pen` files, use the `effect` property with an explicit shadow object: `effect: { type: "shadow", shadowType: "outer", color: "#0000000D", blur: 2, offset: { x: 0, y: 1 } }`.
> - **CRITICAL**: Shadow colors MUST use 8-digit hex format (`#RRGGBBAA`), NOT `rgba()`. The `rgba()` format is silently accepted but produces no visible shadow. Common alpha values: 5%→`0D`, 7%→`12`, 10%→`1A`, 15%→`26`, 20%→`33`.
> - See `foundations-specs.md` Elevation section for the correct `effect` patterns.

### Font Size Tokens

Consistent typographic scale. These map to common text roles.

| Token | Type | Value (px) | Role |
|-------|------|-----------|------|
| `--text-xs` | `number` | `12` | Captions, fine print, badges |
| `--text-sm` | `number` | `14` | Body small, labels, UI text |
| `--text-base` | `number` | `16` | Body default, paragraphs |
| `--text-lg` | `number` | `18` | Large body, lead text |
| `--text-xl` | `number` | `20` | Subheadings, card titles |
| `--text-2xl` | `number` | `24` | Section titles, H3 equivalent |
| `--text-3xl` | `number` | `30` | Large headings, H2 equivalent |
| `--text-4xl` | `number` | `36` | Display headings, H2/H1 |
| `--text-5xl` | `number` | `48` | Hero headings, H1, display text |

### Line Height Tokens

| Token | Type | Value | Use Case |
|-------|------|-------|----------|
| `--leading-tight` | `number` | `1.25` | Headings, display text |
| `--leading-normal` | `number` | `1.5` | Body text, paragraphs |
| `--leading-relaxed` | `number` | `1.75` | Long-form reading, captions |

---

## set_variables JSON Payload Template

Use this template as the base. Replace domain-specific values (marked with `<<<`) per the domain research.

```json
{
  "filePath": "<<<active file path>>>",
  "variables": {
    "--background": {
      "type": "color",
      "value": [
        { "value": "<<<light background>>>", "theme": { "mode": "light" } },
        { "value": "<<<dark background>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--foreground": {
      "type": "color",
      "value": [
        { "value": "#0A0A0A", "theme": { "mode": "light" } },
        { "value": "#FAFAFA", "theme": { "mode": "dark" } }
      ]
    },
    "--card": {
      "type": "color",
      "value": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "<<<dark card>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--card-foreground": {
      "type": "color",
      "value": [
        { "value": "#0A0A0A", "theme": { "mode": "light" } },
        { "value": "#FAFAFA", "theme": { "mode": "dark" } }
      ]
    },
    "--popover": {
      "type": "color",
      "value": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "<<<dark popover>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--popover-foreground": {
      "type": "color",
      "value": [
        { "value": "#0A0A0A", "theme": { "mode": "light" } },
        { "value": "#FAFAFA", "theme": { "mode": "dark" } }
      ]
    },
    "--primary": {
      "type": "color",
      "value": [
        { "value": "<<<primary>>>", "theme": { "mode": "light" } },
        { "value": "<<<primary dark>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--primary-foreground": {
      "type": "color",
      "value": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "#FFFFFF", "theme": { "mode": "dark" } }
      ]
    },
    "--secondary": {
      "type": "color",
      "value": [
        { "value": "<<<secondary light>>>", "theme": { "mode": "light" } },
        { "value": "<<<secondary dark>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--secondary-foreground": {
      "type": "color",
      "value": [
        { "value": "#1A1A1A", "theme": { "mode": "light" } },
        { "value": "#FAFAFA", "theme": { "mode": "dark" } }
      ]
    },
    "--muted": {
      "type": "color",
      "value": [
        { "value": "<<<muted light>>>", "theme": { "mode": "light" } },
        { "value": "<<<muted dark>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--muted-foreground": {
      "type": "color",
      "value": [
        { "value": "#737373", "theme": { "mode": "light" } },
        { "value": "#A3A3A3", "theme": { "mode": "dark" } }
      ]
    },
    "--accent": {
      "type": "color",
      "value": [
        { "value": "<<<accent light>>>", "theme": { "mode": "light" } },
        { "value": "<<<accent dark>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--accent-foreground": {
      "type": "color",
      "value": [
        { "value": "#1A1A1A", "theme": { "mode": "light" } },
        { "value": "#FAFAFA", "theme": { "mode": "dark" } }
      ]
    },
    "--destructive": {
      "type": "color",
      "value": [
        { "value": "#EF4444", "theme": { "mode": "light" } },
        { "value": "#DC2626", "theme": { "mode": "dark" } }
      ]
    },
    "--destructive-foreground": {
      "type": "color",
      "value": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "#FFFFFF", "theme": { "mode": "dark" } }
      ]
    },
    "--border": {
      "type": "color",
      "value": [
        { "value": "#E5E5E5", "theme": { "mode": "light" } },
        { "value": "#2A2A2A", "theme": { "mode": "dark" } }
      ]
    },
    "--input": {
      "type": "color",
      "value": [
        { "value": "#E5E5E5", "theme": { "mode": "light" } },
        { "value": "#2A2A2A", "theme": { "mode": "dark" } }
      ]
    },
    "--ring": {
      "type": "color",
      "value": [
        { "value": "<<<primary>>>", "theme": { "mode": "light" } },
        { "value": "<<<primary dark>>>", "theme": { "mode": "dark" } }
      ]
    },
    "--color-success": { "type": "color", "value": [{ "value": "#22C55E", "theme": { "mode": "light" } }, { "value": "#4ADE80", "theme": { "mode": "dark" } }] },
    "--color-success-foreground": { "type": "color", "value": [{ "value": "#FFFFFF", "theme": { "mode": "light" } }, { "value": "#052E16", "theme": { "mode": "dark" } }] },
    "--color-warning": { "type": "color", "value": [{ "value": "#F59E0B", "theme": { "mode": "light" } }, { "value": "#FBBF24", "theme": { "mode": "dark" } }] },
    "--color-warning-foreground": { "type": "color", "value": [{ "value": "#FFFFFF", "theme": { "mode": "light" } }, { "value": "#451A03", "theme": { "mode": "dark" } }] },
    "--color-error": { "type": "color", "value": [{ "value": "#EF4444", "theme": { "mode": "light" } }, { "value": "#F87171", "theme": { "mode": "dark" } }] },
    "--color-error-foreground": { "type": "color", "value": [{ "value": "#FFFFFF", "theme": { "mode": "light" } }, { "value": "#450A0A", "theme": { "mode": "dark" } }] },
    "--color-info": { "type": "color", "value": [{ "value": "#3B82F6", "theme": { "mode": "light" } }, { "value": "#60A5FA", "theme": { "mode": "dark" } }] },
    "--color-info-foreground": { "type": "color", "value": [{ "value": "#FFFFFF", "theme": { "mode": "light" } }, { "value": "#172554", "theme": { "mode": "dark" } }] },
    "--font-primary": {
      "type": "string",
      "value": "<<<display font>>>"
    },
    "--font-secondary": {
      "type": "string",
      "value": "<<<body font>>>"
    },
    "--font-mono": {
      "type": "string",
      "value": "JetBrains Mono"
    },
    "--radius-none": { "type": "number", "value": 0 },
    "--radius-sm": { "type": "number", "value": 4 },
    "--radius-md": { "type": "number", "value": 8 },
    "--radius-lg": { "type": "number", "value": 12 },
    "--radius-xl": { "type": "number", "value": 16 },
    "--radius-pill": { "type": "number", "value": 9999 },
    "--space-1": { "type": "number", "value": 4 },
    "--space-2": { "type": "number", "value": 8 },
    "--space-3": { "type": "number", "value": 12 },
    "--space-4": { "type": "number", "value": 16 },
    "--space-5": { "type": "number", "value": 20 },
    "--space-6": { "type": "number", "value": 24 },
    "--space-8": { "type": "number", "value": 32 },
    "--space-10": { "type": "number", "value": 40 },
    "--space-12": { "type": "number", "value": 48 },
    "--space-16": { "type": "number", "value": 64 },
    "--space-20": { "type": "number", "value": 80 },
    "--space-24": { "type": "number", "value": 96 },
    "--shadow-sm": { "type": "string", "value": "0 1px 2px rgba(0,0,0,0.05)" },
    "--shadow-md": { "type": "string", "value": "0 4px 6px rgba(0,0,0,0.07)" },
    "--shadow-lg": { "type": "string", "value": "0 10px 15px rgba(0,0,0,0.1)" },
    "--shadow-xl": { "type": "string", "value": "0 20px 25px rgba(0,0,0,0.15)" },
    "--text-xs": { "type": "number", "value": 12 },
    "--text-sm": { "type": "number", "value": 14 },
    "--text-base": { "type": "number", "value": 16 },
    "--text-lg": { "type": "number", "value": 18 },
    "--text-xl": { "type": "number", "value": 20 },
    "--text-2xl": { "type": "number", "value": 24 },
    "--text-3xl": { "type": "number", "value": 30 },
    "--text-4xl": { "type": "number", "value": 36 },
    "--text-5xl": { "type": "number", "value": 48 },
    "--leading-tight": { "type": "number", "value": 1.25 },
    "--leading-normal": { "type": "number", "value": 1.5 },
    "--leading-relaxed": { "type": "number", "value": 1.75 }
  }
}
```

---

## Industry Palette Examples

Ready-to-use color values. Replace `<<<` placeholders in the template above with these values.

### Bakery

```
Primary: #8B4513 (light) / #D4A574 (dark)
Background: #FFF8DC (light) / #1A1410 (dark)
Card: #FFFFFF (light) / #2D2218 (dark)
Secondary: #F5E6D3 (light) / #3D2E1E (dark)
Muted: #F0E4D4 (light) / #261E14 (dark)
Accent: #CD5C5C (light) / #E88E8E (dark)
Font primary: Playfair Display
Font secondary: Nunito
```

### SaaS / B2B

```
Primary: #2563EB (light) / #3B82F6 (dark)
Background: #FFFFFF (light) / #0F172A (dark)
Card: #FFFFFF (light) / #1E293B (dark)
Secondary: #F1F5F9 (light) / #334155 (dark)
Muted: #F8FAFC (light) / #1E293B (dark)
Accent: #7C3AED (light) / #A78BFA (dark)
Font primary: Inter
Font secondary: Inter
```

### Fitness

```
Primary: #EA580C (light) / #F97316 (dark)
Background: #FAFAF9 (light) / #0C0A09 (dark)
Card: #FFFFFF (light) / #1C1917 (dark)
Secondary: #F5F5F4 (light) / #292524 (dark)
Muted: #F5F5F4 (light) / #1C1917 (dark)
Accent: #84CC16 (light) / #A3E635 (dark)
Font primary: Oswald
Font secondary: Roboto
```

### E-commerce

```
Primary: #7C3AED (light) / #A78BFA (dark)
Background: #FFFFFF (light) / #09090B (dark)
Card: #FFFFFF (light) / #18181B (dark)
Secondary: #F4F4F5 (light) / #27272A (dark)
Muted: #F4F4F5 (light) / #27272A (dark)
Accent: #F59E0B (light) / #FBBF24 (dark)
Font primary: Poppins
Font secondary: Open Sans
```

### Restaurant (Fine Dining)

```
Primary: #1A237E (light) / #3949AB (dark)
Background: #FAFAFA (light) / #0D0D12 (dark)
Card: #FFFFFF (light) / #1A1A24 (dark)
Secondary: #F0F0F5 (light) / #2A2A38 (dark)
Muted: #F5F5F8 (light) / #1E1E2A (dark)
Accent: #FFD700 (light) / #FFE066 (dark)
Font primary: Cormorant Garamond
Font secondary: Lato
```

### Coffee Shop

```
Primary: #3E2723 (light) / #8D6E63 (dark)
Background: #F5F0EB (light) / #1A1412 (dark)
Card: #FFFFFF (light) / #2C221E (dark)
Secondary: #EFEBE9 (light) / #3E2723 (dark)
Muted: #EFEBE9 (light) / #2C221E (dark)
Accent: #E65100 (light) / #FF8A65 (dark)
Font primary: DM Serif Display
Font secondary: Inter
```

### Healthcare / Medical

```
Primary: #0F766E (light) / #2DD4BF (dark)
Background: #FFFFFF (light) / #0A1419 (dark)
Card: #FFFFFF (light) / #132028 (dark)
Secondary: #F0FDFA (light) / #1A3038 (dark)
Muted: #F0FDFA (light) / #132028 (dark)
Accent: #38BDF8 (light) / #7DD3FC (dark)
Font primary: Outfit
Font secondary: Inter
```

### Education / EdTech

```
Primary: #0D9488 (light) / #2DD4BF (dark)
Background: #FFFBF0 (light) / #0C0A09 (dark)
Card: #FFFFFF (light) / #1C1917 (dark)
Secondary: #F0FDF9 (light) / #292524 (dark)
Muted: #FFF7ED (light) / #1C1917 (dark)
Accent: #F97316 (light) / #FB923C (dark)
Font primary: Quicksand
Font secondary: Nunito
```

### Real Estate

```
Primary: #1A365D (light) / #2B6CB0 (dark)
Background: #FAF9F6 (light) / #0F1117 (dark)
Card: #FFFFFF (light) / #1A1D27 (dark)
Secondary: #EDF2F7 (light) / #2D3748 (dark)
Muted: #F7FAFC (light) / #1A1D27 (dark)
Accent: #B8860B (light) / #DAA520 (dark)
Font primary: Merriweather
Font secondary: Open Sans
```

### Agency / Portfolio

```
Primary: #111111 (light) / #FAFAFA (dark)
Background: #FAFAFA (light) / #0A0A0A (dark)
Card: #FFFFFF (light) / #171717 (dark)
Secondary: #F5F5F5 (light) / #262626 (dark)
Muted: #F5F5F5 (light) / #1A1A1A (dark)
Accent: #3B82F6 (light) / #60A5FA (dark)
Font primary: Space Grotesk
Font secondary: Inter
```

---

## Token Application Rules

When tokens are used in components:

| Property | Token Example |
|----------|--------------|
| `fill` on buttons | `$--primary`, `$--secondary`, `$--destructive` |
| `fill` on backgrounds | `$--background`, `$--card`, `$--muted` |
| `fill` on text | `$--foreground`, `$--primary-foreground`, `$--muted-foreground` |
| `fontFamily` on headings | `$--font-primary` |
| `fontFamily` on body text | `$--font-secondary` |
| `fontFamily` on code | `$--font-mono` |
| `cornerRadius` on cards | `$--radius-lg` |
| `cornerRadius` on buttons | `$--radius-md` |
| `cornerRadius` on inputs | `$--radius-md` |
| `cornerRadius` on badges | `$--radius-pill` |
| `stroke` on borders | `$--border` |
| `stroke` on inputs | `$--input` |
| `effect` on cards | See shadow-sm in foundations-specs.md Elevation section |
| `effect` on dropdowns | See shadow-md in foundations-specs.md Elevation section |
| `effect` on modals | See shadow-lg in foundations-specs.md Elevation section |
| `fontSize` on H1 | `$--text-5xl` |
| `fontSize` on H2 | `$--text-4xl` |
| `fontSize` on H3 | `$--text-2xl` |
| `fontSize` on body | `$--text-base` |
| `fontSize` on labels/buttons | `$--text-sm` |
| `fontSize` on captions/badges | `$--text-xs` |
| `lineHeight` on headings | `$--leading-tight` |
| `lineHeight` on body | `$--leading-normal` |
| `padding` on cards | `$--space-4` or `$--space-6` |
| `gap` on sections | `$--space-6` or `$--space-8` |
| `padding` on page sections | `$--space-20` |

---

## Tailwind CSS Variable Mapping

When exporting to Tailwind CSS, each token maps to a CSS custom property and corresponding Tailwind utility. The table below shows the mapping for both v3 (named utilities via config) and v4 (arbitrary value syntax, no config).

**shadcn/ui compatibility:** Our token naming (`--primary`, `--background`, `--foreground`, etc.) is identical to shadcn/ui's convention. Exported code is drop-in compatible with shadcn/ui projects.

### Color Token Mapping

| Pencil Token | CSS Variable | v3 Utility | v4 Utility |
|-------------|-------------|-----------|-----------|
| `$--background` | `--background` | `bg-background` | `bg-[var(--background)]` |
| `$--foreground` | `--foreground` | `text-foreground` | `text-[var(--foreground)]` |
| `$--primary` | `--primary` | `bg-primary` | `bg-[var(--primary)]` |
| `$--primary-foreground` | `--primary-foreground` | `text-primary-foreground` | `text-[var(--primary-foreground)]` |
| `$--secondary` | `--secondary` | `bg-secondary` | `bg-[var(--secondary)]` |
| `$--muted` | `--muted` | `bg-muted` | `bg-[var(--muted)]` |
| `$--accent` | `--accent` | `bg-accent` | `bg-[var(--accent)]` |
| `$--destructive` | `--destructive` | `bg-destructive` | `bg-[var(--destructive)]` |
| `$--border` | `--border` | `border-border` | `border-[var(--border)]` |
| `$--ring` | `--ring` | `ring-ring` | `ring-[var(--ring)]` |

### Non-Color Token Mapping

| Pencil Token | CSS Variable | v3 Utility | v4 Utility |
|-------------|-------------|-----------|-----------|
| `$--radius-md` | `--radius-md` | `rounded-md` | `rounded-[var(--radius-md)]` |
| `$--radius-lg` | `--radius-lg` | `rounded-lg` | `rounded-[var(--radius-lg)]` |
| `$--radius-pill` | `--radius-pill` | `rounded-pill` | `rounded-[var(--radius-pill)]` |
| `$--text-sm` | `--text-sm` | `text-sm` | `text-[length:var(--text-sm)]` |
| `$--text-base` | `--text-base` | `text-base` | `text-[length:var(--text-base)]` |
| `$--text-5xl` | `--text-5xl` | `text-5xl` | `text-[length:var(--text-5xl)]` |
| `$--shadow-sm` | `--shadow-sm` | `shadow-sm` | `shadow-[var(--shadow-sm)]` |
| `$--shadow-lg` | `--shadow-lg` | `shadow-lg` | `shadow-[var(--shadow-lg)]` |
| `$--space-4` | `--space-4` | `p-4` / `gap-4` | `p-[var(--space-4)]` |
| `$--leading-normal` | `--leading-normal` | `leading-normal` | `leading-[var(--leading-normal)]` |

### HSL Conversion (v3 Only)

Tailwind v3 uses `hsl(var(--primary))` in the config, which requires CSS variables to store HSL components without the `hsl()` wrapper:

```
Hex:  #8B4513
HSL:  25 75% 31%   ← stored in :root as --primary: 25 75% 31%;
```

Tailwind v4 uses hex values directly — no conversion needed.

See `references/code-export-guide.md` for the complete export workflow and component templates.

---

## Token Count Summary

| Category | Count |
|----------|-------|
| Core colors | 19 |
| Semantic colors | 8 |
| Typography | 3 |
| Border radius | 6 |
| Spacing | 12 |
| Shadows | 4 |
| Font sizes | 9 |
| Line heights | 3 |
| **Total** | **64** |

---

## Customization: User-Specified Colors & Fonts

### Priority Order for Token Values

When deciding token values, follow this priority:

1. **User-specified values** — If the user says "use terracotta and cream," those override everything.
2. **Research-validated values** — From Phase 1 WebSearch, validated against real sites.
3. **Industry palette tables** — The fallback defaults above.

### Handling User-Specified Colors

When the user provides specific colors (e.g., "build a bakery design system with #D2691E as primary and #FFFDD0 as background"):

1. **Map to tokens directly:**
   - Named primary color → `--primary`
   - Named background/secondary colors → `--background`, `--secondary`, or `--accent`
2. **Derive the rest of the palette:**
   - `--primary-foreground`: White or near-black depending on primary brightness
   - `--secondary`: Lighter tint of background (10–15% toward white)
   - `--muted`: Even lighter tint of background
   - `--border`, `--input`: Neutral gray derived from the background tone
   - `--foreground`: Near-black for light themes, near-white for dark
   - `--card`: White for light, darkened background for dark
3. **Dark theme:** Lighten the primary by 20–30%, darken the background to near-black, invert foreground/muted-foreground.

### Handling User-Specified Fonts

When the user provides font preferences (e.g., "use Lora for headings"):

1. Map to the appropriate token (`--font-primary` for headings, `--font-secondary` for body)
2. If only one font is specified, research a complementary pairing for the other
3. Validate Google Fonts availability

### Post-Creation Bulk Color Update

Since every component uses `$--` variable references, changing token values updates the entire design system instantly. **No per-node updates needed.**

**To change the primary color after the system is built:**

```json
set_variables({
  "filePath": "path/to/file.pen",
  "variables": {
    "--primary": {
      "type": "color",
      "values": [
        { "value": "#NEW_LIGHT_HEX", "theme": { "mode": "light" } },
        { "value": "#NEW_DARK_HEX", "theme": { "mode": "dark" } }
      ]
    },
    "--primary-foreground": {
      "type": "color",
      "values": [
        { "value": "#FFFFFF", "theme": { "mode": "light" } },
        { "value": "#FFFFFF", "theme": { "mode": "dark" } }
      ]
    }
  }
})
```

**To change fonts:**

```json
set_variables({
  "filePath": "path/to/file.pen",
  "variables": {
    "--font-primary": { "type": "string", "values": [{ "value": "New Display Font" }] },
    "--font-secondary": { "type": "string", "values": [{ "value": "New Body Font" }] }
  }
})
```

**To do a full palette swap** (e.g., rebrand from bakery to coffee shop), call `set_variables` with all 19 core color tokens + 3 font tokens. The entire system — foundations, components, patterns, screens — updates in one call.

> **Warning:** Do NOT use `replace_all_matching_properties` with `$--` variable references in the `to` field — it corrupts variable bindings, causing them to resolve as `#00000000` (transparent). Always use `set_variables` for bulk token changes.
