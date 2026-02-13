# Foundations Specs

Exact `batch_design` operation code for the visual foundation documentation frames. Load this file during Phase 4.

These frames are **documentation, not components** — they do NOT have `reusable: true`. They visually showcase the design system's tokens so anyone opening the `.pen` file sees the token system at a glance.

## Important Notes

- Foundation frames are NOT reusable — they're visual documentation only.
- **Use a neutral white backdrop (`fill: "#FFFFFF"`) for the Foundations section frame — NOT `$--background`.** The Foundations section is documentation chrome, not a product screen. Using the design system's own themed background (e.g., cream for a bakery) makes light swatches like `--card` (white), `--secondary` (light cream), and `--muted` (tan) nearly invisible. Professional design system docs use a neutral backdrop so all colors are evaluated accurately against a known reference.
- All swatch fills use `$--` variable tokens. Only the documentation frame itself uses a hardcoded neutral white.
- Max 25 operations per `batch_design` call — foundations are split across 3 batches.
- After each batch, call `get_screenshot` to verify rendering.
- The Foundations section is placed at the leftmost position on the canvas.

---

## Pre-requisite: Create the Foundations Section Frame

Before building any documentation frames, create the master section frame. This is the first frame on the canvas.

```javascript
foundations=I("document", { type: "frame", name: "Foundations", width: 1440, height: 2400, x: 0, y: 0, layout: "vertical", padding: [60, 80, 60, 80], gap: 48, fill: "#FFFFFF" })
foundationsTitle=I(foundations, { type: "text", content: "Foundations", fontFamily: "$--font-primary", fontSize: 48, fontWeight: "700", fill: "$--foreground" })
foundationsSubtitle=I(foundations, { type: "text", content: "Design tokens and visual language", fontFamily: "$--font-secondary", fontSize: 18, fill: "$--muted-foreground", width: "fill_container" })
```

**3 operations** — run this as the start of Batch A or as a separate call.

---

## Batch A — Color Palette + Typography Scale (~24 operations)

### Color Palette

A grid of labeled color swatches showing all 27 color tokens (19 core + 8 semantic).

```javascript
colorSection=I(foundations, { type: "frame", name: "Color Palette", layout: "vertical", gap: 24, width: "fill_container" })
colorTitle=I(colorSection, { type: "text", content: "Color Palette", fontFamily: "$--font-primary", fontSize: 32, fontWeight: "700", fill: "$--foreground" })
colorDesc=I(colorSection, { type: "text", content: "Core and semantic color tokens with light/dark theme support.", fontFamily: "$--font-secondary", fontSize: 14, fill: "$--muted-foreground", width: "fill_container" })

coreRow1=I(colorSection, { type: "frame", name: "Core Colors Row 1", layout: "horizontal", gap: 12, width: "fill_container" })

swBg=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swBgBox=I(swBg, { type: "frame", fill: "$--background", stroke: "$--border", strokeThickness: 1, cornerRadius: "$--radius-md", width: 120, height: 64 })
swBgLabel=I(swBg, { type: "text", content: "--background", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swFg=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swFgBox=I(swFg, { type: "frame", fill: "$--foreground", cornerRadius: "$--radius-md", width: 120, height: 64 })
swFgLabel=I(swFg, { type: "text", content: "--foreground", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swPrimary=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swPrimaryBox=I(swPrimary, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-md", width: 120, height: 64 })
swPrimaryLabel=I(swPrimary, { type: "text", content: "--primary", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swSecondary=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swSecondaryBox=I(swSecondary, { type: "frame", fill: "$--secondary", cornerRadius: "$--radius-md", width: 120, height: 64 })
swSecondaryLabel=I(swSecondary, { type: "text", content: "--secondary", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swMuted=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swMutedBox=I(swMuted, { type: "frame", fill: "$--muted", cornerRadius: "$--radius-md", width: 120, height: 64 })
swMutedLabel=I(swMuted, { type: "text", content: "--muted", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swAccent=I(coreRow1, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swAccentBox=I(swAccent, { type: "frame", fill: "$--accent", cornerRadius: "$--radius-md", width: 120, height: 64 })
swAccentLabel=I(swAccent, { type: "text", content: "--accent", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })
```

**24 operations** (3 section setup + 3 per swatch × 7 swatches = 21 + 3 = 24). Within the 25-op limit.

> **Note:** This batch covers the first row of core color swatches. Continue with additional rows in Batch B.

---

## Batch B — Remaining Color Swatches + Semantic Colors (24 operations)

Continue the color palette with additional core colors and semantic colors (excluding Info swatch — moved to Batch C).

```javascript
coreRow2=I(colorSection, { type: "frame", name: "Core Colors Row 2", layout: "horizontal", gap: 12, width: "fill_container" })

swDestructive=I(coreRow2, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swDestructiveBox=I(swDestructive, { type: "frame", fill: "$--destructive", cornerRadius: "$--radius-md", width: 120, height: 64 })
swDestructiveLabel=I(swDestructive, { type: "text", content: "--destructive", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swBorder=I(coreRow2, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swBorderBox=I(swBorder, { type: "frame", fill: "$--border", cornerRadius: "$--radius-md", width: 120, height: 64 })
swBorderLabel=I(swBorder, { type: "text", content: "--border", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swCard=I(coreRow2, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swCardBox=I(swCard, { type: "frame", fill: "$--card", stroke: "$--border", strokeThickness: 1, cornerRadius: "$--radius-md", width: 120, height: 64 })
swCardLabel=I(swCard, { type: "text", content: "--card", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swInput=I(coreRow2, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swInputBox=I(swInput, { type: "frame", fill: "$--input", cornerRadius: "$--radius-md", width: 120, height: 64 })
swInputLabel=I(swInput, { type: "text", content: "--input", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

semanticLabel=I(colorSection, { type: "text", content: "Semantic Colors", fontFamily: "$--font-primary", fontSize: 20, fontWeight: "600", fill: "$--foreground" })
semanticRow=I(colorSection, { type: "frame", name: "Semantic Colors", layout: "horizontal", gap: 12, width: "fill_container" })

swSuccess=I(semanticRow, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swSuccessBox=I(swSuccess, { type: "frame", fill: "$--color-success", cornerRadius: "$--radius-md", width: 120, height: 64 })
swSuccessLabel=I(swSuccess, { type: "text", content: "--color-success", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swWarning=I(semanticRow, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swWarningBox=I(swWarning, { type: "frame", fill: "$--color-warning", cornerRadius: "$--radius-md", width: 120, height: 64 })
swWarningLabel=I(swWarning, { type: "text", content: "--color-warning", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

swError=I(semanticRow, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swErrorBox=I(swError, { type: "frame", fill: "$--color-error", cornerRadius: "$--radius-md", width: 120, height: 64 })
swErrorLabel=I(swError, { type: "text", content: "--color-error", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })
```

**24 operations:**
- `coreRow2` = 1
- 4 core swatches × 3 ops each = 12
- `semanticLabel` + `semanticRow` = 2
- 3 semantic swatches × 3 ops each = 9
- **Total: 24** ✓

---

## Batch C — Typography Scale + Spacing Scale + Elevation + Radius (~25 operations)

### Remaining Color (Info swatch — 3 ops)

```javascript
swInfo=I(semanticRow, { type: "frame", layout: "vertical", gap: 6, width: 120 })
swInfoBox=I(swInfo, { type: "frame", fill: "$--color-info", cornerRadius: "$--radius-md", width: 120, height: 64 })
swInfoLabel=I(swInfo, { type: "text", content: "--color-info", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })
```

### Typography Scale (8 ops)

```javascript
typoSection=I(foundations, { type: "frame", name: "Typography Scale", layout: "vertical", gap: 20, width: "fill_container" })
typoTitle=I(typoSection, { type: "text", content: "Typography Scale", fontFamily: "$--font-primary", fontSize: 32, fontWeight: "700", fill: "$--foreground" })

typoH1=I(typoSection, { type: "frame", layout: "vertical", gap: 4, width: "fill_container" })
typoH1Sample=I(typoH1, { type: "text", content: "Heading 1 — 48px / 700", fontFamily: "$--font-primary", fontSize: 48, fontWeight: "700", fill: "$--foreground", width: "fill_container" })

typoH2Sample=I(typoSection, { type: "text", content: "Heading 2 — 36px / 700", fontFamily: "$--font-primary", fontSize: 36, fontWeight: "700", fill: "$--foreground", width: "fill_container" })

typoH3Sample=I(typoSection, { type: "text", content: "Heading 3 — 24px / 600", fontFamily: "$--font-primary", fontSize: 24, fontWeight: "600", fill: "$--foreground", width: "fill_container" })

typoBodySample=I(typoSection, { type: "text", content: "Body — 16px / 400. The quick brown fox jumps over the lazy dog.", fontFamily: "$--font-secondary", fontSize: 16, fontWeight: "400", fill: "$--foreground", width: "fill_container", lineHeight: 1.6 })

typoCaptionSample=I(typoSection, { type: "text", content: "Caption — 12px / 400. Secondary information and metadata.", fontFamily: "$--font-secondary", fontSize: 12, fontWeight: "400", fill: "$--muted-foreground", width: "fill_container" })
```

### Spacing Scale (8 ops)

```javascript
spaceSection=I(foundations, { type: "frame", name: "Spacing Scale", layout: "vertical", gap: 16, width: "fill_container" })
spaceTitle=I(spaceSection, { type: "text", content: "Spacing Scale", fontFamily: "$--font-primary", fontSize: 32, fontWeight: "700", fill: "$--foreground" })
spaceRow=I(spaceSection, { type: "frame", layout: "horizontal", gap: 16, width: "fill_container", alignItems: "flex_end" })

sp4=I(spaceRow, { type: "frame", layout: "vertical", gap: 4, alignItems: "center" })
sp4Box=I(sp4, { type: "frame", fill: "$--primary", width: 4, height: 4, cornerRadius: "$--radius-sm" })
sp4Label=I(sp4, { type: "text", content: "4", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground", textAlignHorizontal: "center" })
```

> **Note:** Repeat the `sp*` pattern for spacing values 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Each takes 3 operations (frame + box + label). Due to the 25-op limit, include only a representative set in this batch and continue in Batch D if needed.

### Elevation (6 ops)

```javascript
elevSection=I(foundations, { type: "frame", name: "Elevation", layout: "vertical", gap: 16, width: "fill_container" })
elevTitle=I(elevSection, { type: "text", content: "Elevation", fontFamily: "$--font-primary", fontSize: 32, fontWeight: "700", fill: "$--foreground" })
elevRow=I(elevSection, { type: "frame", layout: "horizontal", gap: 24, width: "fill_container" })

elevSm=I(elevRow, { type: "frame", layout: "vertical", fill: "$--card", cornerRadius: "$--radius-lg", width: 160, height: 100, padding: 16, shadow: "$--shadow-sm", mainAxisAlignment: "center", alignItems: "center" })
elevSmLabel=I(elevSm, { type: "text", content: "shadow-sm", fontFamily: "$--font-mono", fontSize: 12, fill: "$--muted-foreground", textAlignHorizontal: "center" })

elevMd=I(elevRow, { type: "frame", layout: "vertical", fill: "$--card", cornerRadius: "$--radius-lg", width: 160, height: 100, padding: 16, shadow: "$--shadow-md", mainAxisAlignment: "center", alignItems: "center" })
elevMdLabel=I(elevMd, { type: "text", content: "shadow-md", fontFamily: "$--font-mono", fontSize: 12, fill: "$--muted-foreground", textAlignHorizontal: "center" })
```

> Continue with `shadow-lg` and `shadow-xl` in the same pattern. 2 more shadow cards = 4 additional ops.

**Batch C estimated: 25 operations** (3 info swatch + 8 typography + 8 spacing + 6 elevation = 25).

---

## Batch D — Remaining Elevation + Border Radius (~14 operations)

### Remaining Elevation Cards (4 ops)

```javascript
elevLg=I(elevRow, { type: "frame", layout: "vertical", fill: "$--card", cornerRadius: "$--radius-lg", width: 160, height: 100, padding: 16, shadow: "$--shadow-lg", mainAxisAlignment: "center", alignItems: "center" })
elevLgLabel=I(elevLg, { type: "text", content: "shadow-lg", fontFamily: "$--font-mono", fontSize: 12, fill: "$--muted-foreground", textAlignHorizontal: "center" })

elevXl=I(elevRow, { type: "frame", layout: "vertical", fill: "$--card", cornerRadius: "$--radius-lg", width: 160, height: 100, padding: 16, shadow: "$--shadow-xl", mainAxisAlignment: "center", alignItems: "center" })
elevXlLabel=I(elevXl, { type: "text", content: "shadow-xl", fontFamily: "$--font-mono", fontSize: 12, fill: "$--muted-foreground", textAlignHorizontal: "center" })
```

### Border Radius Showcase (10 ops)

```javascript
radiusSection=I(foundations, { type: "frame", name: "Border Radius", layout: "vertical", gap: 16, width: "fill_container" })
radiusTitle=I(radiusSection, { type: "text", content: "Border Radius", fontFamily: "$--font-primary", fontSize: 32, fontWeight: "700", fill: "$--foreground" })
radiusRow=I(radiusSection, { type: "frame", layout: "horizontal", gap: 16, width: "fill_container" })

radNone=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radNoneBox=I(radNone, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-none", width: 80, height: 80 })
radNoneLabel=I(radNone, { type: "text", content: "none (0)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

radSm=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radSmBox=I(radSm, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-sm", width: 80, height: 80 })
radSmLabel=I(radSm, { type: "text", content: "sm (4)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })
```

> Continue with `--radius-md` (8), `--radius-lg` (12), `--radius-xl` (16), and `--radius-pill` (9999). Each takes 3 operations.

**Batch D estimated: 4 elevation + 3 section setup + 2 radius examples × 3 = 6 + remaining 4 radius × 3 = 12 → adjust to fit within batch or split.**

**Full Batch D: 4 + 10 = 14 operations.** Continue remaining radii if needed:

```javascript
radMd=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radMdBox=I(radMd, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-md", width: 80, height: 80 })
radMdLabel=I(radMd, { type: "text", content: "md (8)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

radLg=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radLgBox=I(radLg, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-lg", width: 80, height: 80 })
radLgLabel=I(radLg, { type: "text", content: "lg (12)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

radXl=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radXlBox=I(radXl, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-xl", width: 80, height: 80 })
radXlLabel=I(radXl, { type: "text", content: "xl (16)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })

radPill=I(radiusRow, { type: "frame", layout: "vertical", gap: 6, alignItems: "center" })
radPillBox=I(radPill, { type: "frame", fill: "$--primary", cornerRadius: "$--radius-pill", width: 80, height: 80 })
radPillLabel=I(radPill, { type: "text", content: "pill (9999)", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground" })
```

**Full Batch D total: 4 elevation + 3 section setup + 6 radius examples × 3 = 18 + 3 = 25 operations.** Right at the limit.

---

## Summary

| Batch | Content | Operations |
|-------|---------|------------|
| Pre | Foundations section frame + title + subtitle | 3 |
| A | Color Palette section + 7 core swatches | 24 |
| B | 4 more core swatches + semantic label + 3 semantic swatches | 24 |
| C | Info swatch + Typography Scale + Spacing intro + Elevation intro | 25 |
| D | Remaining Elevation + Border Radius showcase | 25 |
| **Total** | **5 documentation frames** | **~101** |

All batches are within the 25-operation limit. Call `get_screenshot({ filePath, nodeId: foundationsId })` after each batch to verify rendering.

---

## Additional Spacing Blocks

If the 25-op limit in Batch C doesn't fit all 12 spacing values, create an additional batch for the remaining spacing blocks. Each spacing value follows the same pattern:

```javascript
spN=I(spaceRow, { type: "frame", layout: "vertical", gap: 4, alignItems: "center" })
spNBox=I(spN, { type: "frame", fill: "$--primary", width: N, height: N, cornerRadius: "$--radius-sm" })
spNLabel=I(spN, { type: "text", content: "N", fontFamily: "$--font-mono", fontSize: 11, fill: "$--muted-foreground", textAlignHorizontal: "center" })
```

Where N is the spacing value: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

The box dimensions visually represent the spacing value — a `--space-4` shows a 4×4 box, while `--space-24` shows a 24×24 box, making the scale immediately tangible.
