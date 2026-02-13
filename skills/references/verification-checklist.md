# Verification Checklist

Complete QA process for Phase 9. Run every check, fix every issue, re-verify after fixes.

## Verification Sequence

Execute these checks in order. Each check may produce issues that need fixing before moving to the next.

### Check 0 — Canvas Structure

**Tool:** `batch_get({ filePath })` (list top-level document children)

Verify the canvas has the correct organizational structure:

| Section | Expected Position | Required |
|---------|------------------|----------|
| **Foundations** | x: 0, y: 0, 1440×2400 | Yes |
| **Components** | x: 1540, y: 0, 1440×2400 | Yes |
| **Patterns** | x: 3080, y: 0, 1440×1800 | Yes |
| **Screens** | x: 4620+, y: 0 | Yes (3-5 screens) |
| **Navigation Index** | x: 0, y: -200 (or nearby) | Optional |

**Check for:**
- All 4 section frames exist as direct children of document root
- Section frames are in the correct left-to-right order
- No orphan components at document root (everything under its section)
- Adequate spacing between sections (≥100px)

**Fix process:**
1. If a section is missing, create it at the correct position
2. If orphan nodes exist, move them into the correct section with `M()`
3. If positions are wrong, update with `U("sectionId", { x: correctX })`

### Check 1 — Foundation Documentation

**Tool:** `batch_get({ filePath, parentId: "foundationsId", patterns: [{ type: "frame" }], searchDepth: 2 })`

Verify all 5 documentation frames are present inside Foundations:

| Frame | Content | Min Elements |
|-------|---------|-------------|
| **Color Palette** | Swatches for core + semantic colors | 11+ swatches |
| **Typography Scale** | 6 specimens (H1–Caption) at real sizes | 6 text samples |
| **Spacing Scale** | Visual blocks for spacing values | 6+ blocks |
| **Elevation** | Cards at different shadow levels | 4 shadow cards |
| **Border Radius** | Rectangles showing each radius | 6 radius examples |

**Check for:**
- Each documentation frame has a title text node
- Color swatches use `$--` token fills (not hardcoded hex)
- Typography specimens use `$--font-primary` and `$--font-secondary`
- Spacing blocks accurately represent their token values
- All frames render correctly in `get_screenshot`

### Check 2 — Visual Screenshot Review

**Tool:** `get_screenshot({ filePath, nodeId: "screenId" })`

Run on every screen and every pattern. Analyze each screenshot for:

| Category | What to Look For |
|----------|-----------------|
| **Alignment** | Elements should snap to a consistent grid. Left edges of stacked elements should align. Horizontal groups should be vertically centered. |
| **Spacing** | Consistent padding within components. Consistent gaps between sections. No cramped or overly spacious areas. |
| **Typography** | Clear hierarchy: H1 > H2 > H3 > Body > Caption. Headings use display font, body uses body font. No orphaned single words on lines (adjust width if needed). |
| **Color** | Sufficient contrast between text and background. Primary color used for CTAs and key actions. Semantic colors used correctly (green=success, red=error, etc.). |
| **Overflow** | No text cut off or clipping outside containers. No elements extending beyond screen bounds. Scrollable areas clearly indicated. |
| **Domain fit** | Imagery matches the domain. Copy tone matches the business type. Color palette feels appropriate for the industry. |
| **Completeness** | All sections populated with real-looking content. No placeholder "lorem ipsum" text. No empty frames or missing images. |

### Check 3 — Layout Problem Detection

**Tool:** `snapshot_layout({ filePath, problemsOnly: true })`

This returns only nodes with layout problems. Common issues:

| Problem | Cause | Fix |
|---------|-------|-----|
| **Clipped content** | Child extends beyond parent bounds | Add `clip: true` on parent, or expand parent dimensions, or constrain child with `width: "fill_container"` |
| **Overlapping nodes** | Absolute-positioned children overlap | Use layout (vertical/horizontal) instead of absolute positioning, or adjust x/y coordinates |
| **Zero-size frame** | Frame has no children and no explicit size | Set explicit width/height, or ensure children provide implicit size via `hug_contents` |
| **Overflow text** | Text wider than container | Add `width: "fill_container"` to text node, or increase parent width |

**Fix process:**
1. Read the problem node IDs from the result
2. Use `batch_get({ nodeIds: [problemId] })` to understand the node structure
3. Fix with `batch_design` using `U()` to update properties
4. Re-run `snapshot_layout` to confirm fix

### Check 4 — Token Audit (No Hardcoded Colors or Font Sizes)

**Tool:** `search_all_unique_properties({ filePath, parents: [screenId1, screenId2, ...], properties: ["fillColor", "textColor", "fontSize"] })`

**Expected result:** Only variable token references (starting with `$--`) should appear. For colors, any raw hex values (like `#8B4513`) indicate a leak. For font sizes, all values must match the `$--text-*` scale: 12, 14, 16, 18, 20, 24, 30, 36, 48.

**Common sources of leaks:**
- Text content color not set (defaults to black `#000000`)
- Background fill missed during component creation
- Stroke color set as hex instead of `$--border`
- Copy operation didn't carry variable references

**Fix process:**
1. Identify all leaked hex values from the audit
2. Map each hex to its corresponding token (e.g., `#8B4513` → `$--primary`)
3. Use `replace_all_matching_properties` for bulk fixes:
   ```
   replace_all_matching_properties({
     filePath,
     parents: [screenId1, screenId2],
     properties: {
       fillColor: [{ from: "#8B4513", to: "$--primary" }],
       textColor: [{ from: "#000000", to: "$--foreground" }]
     }
   })
   ```
4. Re-run the audit to confirm no leaks remain

Also check fonts:
```
search_all_unique_properties({
  filePath,
  parents: [screenId1, screenId2],
  properties: ["fontFamily"]
})
```

Only `$--font-primary`, `$--font-secondary`, and `$--font-mono` should appear.

### Check 5 — Component Count Audit

**Tool:** `batch_get({ filePath, patterns: [{ reusable: true }], readDepth: 1 })`

**Expected:** ~25 or more reusable components. Verify the count and names match the Component Inventory in SKILL.md.

**Check for:**
- Missing components (compare against the inventory table)
- Duplicate components (same functionality created twice)
- Components without `reusable: true` (they won't be recognized as components)
- Naming consistency (all should follow `Category/Variant` pattern)

### Check 6 — Organization Audit

**Tool:** `batch_get({ filePath })` (list top-level document children)

**Verify:**
- No reusable components exist at document root level
- All reusable components are nested inside the Components section frame
- Components are organized under category sub-frames (Buttons, Inputs, Typography, etc.)
- Each category sub-frame has a title text node

**Check process:**
1. List all direct children of document root
2. For each child that has `reusable: true`, flag it as an orphan
3. Move orphan components into the correct category frame with `M()`

### Check 7 — Pattern Showcase Audit

**Tool:** `batch_get({ filePath, parentId: "patternsSectionId", patterns: [{ type: "frame" }], searchDepth: 2 })`

**Verify all 4 pattern showcases exist:**

| Pattern | Required Elements |
|---------|------------------|
| **Form Pattern** | InputGroup refs, Submit button ref, form card frame |
| **Data Display Pattern** | Table ref, Pagination ref, header with title + action button |
| **Navigation Pattern** | Sidebar ref, Breadcrumb refs, Tab refs |
| **Card Layout Pattern** | 3+ Card refs in a grid with customized content |

**Check for:**
- Each pattern uses only `ref` instances (no inline component recreation)
- Patterns have descriptive titles and descriptions
- Pattern content is realistic (not placeholder text)

### Check 8 — Screen Completeness Audit

**Tool:** `batch_get({ filePath, patterns: [{ type: "frame" }], searchDepth: 1 })` on the document root

**Check:**
- Expected number of screens created (3–5 based on domain)
- Each screen has a descriptive name
- Screen dimensions are appropriate (typically 1440 × 900 for desktop)

For each screen, verify it uses `ref` instances:
```
batch_get({ filePath, parentId: "screenId", patterns: [{ type: "ref" }], searchDepth: 5 })
```

### Check 9 — Screen Conformance Validation

**Purpose:** Verify that any screen (built during Phase 8 or later by the user) fully conforms to the design system — no hardcoded colors, no raw font sizes, no inline components, and no layout problems.

**When to run:** After creating ANY screen — whether during the initial build (Phase 8) or when a user asks to build additional screens (e.g., "design a login page").

**Tool sequence:**

#### Step 1 — Layout problems

```
snapshot_layout({ filePath, parentId: "screenId", problemsOnly: true })
```

Expected: No clipping, overflow, or zero-size frames. Fix any problems before continuing.

#### Step 2 — Color token compliance

```
search_all_unique_properties({
  filePath,
  parents: ["screenId"],
  properties: ["fillColor", "textColor", "strokeColor"]
})
```

The tool resolves `$--` tokens to their computed hex values. Cross-reference the returned hex values against the design system's token definitions (from `get_variables`). If any hex value does NOT match a known token value, it's a hardcoded leak.

**To confirm tokenization (since the tool resolves variables):** Use `batch_get({ nodeIds: [suspectNodeId], readDepth: 1 })` and check that the raw property starts with `$--`.

#### Step 3 — Font compliance

```
search_all_unique_properties({
  filePath,
  parents: ["screenId"],
  properties: ["fontFamily"]
})
```

Only `$--font-primary`, `$--font-secondary`, and `$--font-mono` resolved values should appear. Any other font family is a leak.

#### Step 4 — Font size token compliance

```
search_all_unique_properties({
  filePath,
  parents: ["screenId"],
  properties: ["fontSize"]
})
```

Cross-reference returned values against the token scale: 12 (`$--text-xs`), 14 (`$--text-sm`), 16 (`$--text-base`), 18 (`$--text-lg`), 20 (`$--text-xl`), 24 (`$--text-2xl`), 30 (`$--text-3xl`), 36 (`$--text-4xl`), 48 (`$--text-5xl`).

If a value doesn't match any token, either:
1. The node uses a raw pixel value → fix with `U("nodeId", { fontSize: "$--text-*" })`
2. The design system needs a new size token → add via `set_variables`, then reference it

**To confirm tokenization:** Read the suspect node with `batch_get` and verify `fontSize` starts with `$--`.

#### Step 5 — Component ref usage

```
batch_get({ filePath, parentId: "screenId", patterns: [{ type: "ref" }], searchDepth: 5 })
```

Count the refs. A well-built screen should have 5+ component refs. If the screen has many frames/text nodes but few refs, components may have been recreated inline instead of referenced.

**Conformance verdict:**

| Check | Pass Criteria |
|-------|--------------|
| Layout | 0 problems from `snapshot_layout` |
| Colors | All fill/text/stroke values resolve to known token hex values |
| Fonts | Only `$--font-*` resolved font families |
| Font sizes | All sizes match the `$--text-*` token scale |
| Refs | 5+ component `ref` instances used |

If all 5 checks pass, the screen conforms to the design system.

---

## Common Issue Patterns

### Issue: Text Overflow

**Symptom:** Text extends beyond its container in screenshot.

**Root cause:** Text node has no width constraint.

**Fix:**
```javascript
U("textNodeId", { width: "fill_container" })
```

Or if the text should truncate:
```javascript
U("textNodeId", { width: "fill_container", maxLines: 1 })
```

### Issue: Inconsistent Padding

**Symptom:** Some cards/components have different padding than others.

**Root cause:** Manually set padding values instead of consistent tokens.

**Fix:** Standardize padding values. Common system:
- `4` — tight (badges, tags)
- `8` — compact (list items, small buttons)
- `10-12` — standard (buttons, inputs, table cells)
- `16` — comfortable (card sections)
- `20-24` — spacious (card outer, content areas)
- `32-40` — section padding
- `80` — page-level horizontal padding

### Issue: Missing Borders

**Symptom:** Cards or inputs appear to float without definition.

**Root cause:** No stroke set on container frames.

**Fix:**
```javascript
U("cardId", { stroke: "$--border", strokeThickness: 1 })
```

### Issue: Color Contrast Failure

**Symptom:** Text is hard to read against its background.

**Root cause:** Wrong foreground token used.

**Fix:** Match foreground to background:
- On `$--primary` background → use `$--primary-foreground`
- On `$--card` background → use `$--card-foreground`
- On `$--muted` background → use `$--muted-foreground`
- On `$--background` → use `$--foreground`

### Issue: Flat Component Hierarchy

**Symptom:** All elements are direct children of the screen frame.

**Root cause:** Missing intermediate layout frames.

**Fix:** Group related elements into layout frames:
```javascript
section=I(screen, { type: "frame", name: "Hero", layout: "vertical", gap: 24, padding: [80, 80, 80, 80], width: "fill_container" })
M("headlineId", section)
M("subtextId", section)
```

### Issue: Images Not Loading

**Symptom:** Empty frames where images should be.

**Root cause:** `G()` operation failed or frame type is wrong.

**Fix:** Ensure the target is a `frame` or `rectangle` node, not a text node. Re-run:
```javascript
G("frameId", "stock", "more specific search terms")
```

If stock fails, try AI-generated:
```javascript
G("frameId", "ai", "detailed description of desired image")
```

### Issue: Orphan Components at Root

**Symptom:** Components appear at canvas root instead of inside Components section.

**Root cause:** Components were inserted with `I("document", ...)` instead of `I(componentsSection, ...)`.

**Fix:** Move the orphan into the correct category frame:
```javascript
M("orphanComponentId", "categoryFrameId")
```

---

## Final Presentation Template

After all checks pass, present to the user:

```
## Design System Complete

**Domain:** [Business type]
**File:** [.pen file path]

### Canvas Structure
- **Foundations** — Color palette (27 tokens), typography scale, spacing, elevation, radius
- **Components** — [count] reusable components organized in [count] categories
- **Patterns** — 4 composition showcases (Form, Data Display, Navigation, Card Layout)
- **Screens** — [count] domain screens

### What Was Created

**Design Tokens:** [count] variables with light/dark themes
- Colors: [primary color name] palette with [count] color tokens
- Typography: [display font] + [body font]
- Spacing: 12-step scale (4px – 96px)
- Shadows: 4 elevation levels
- Font sizes: 6-step typographic scale
- Line heights: 3 reading density options
- Border radius: 6 scale stops

**Components:** [count] reusable components
- Primitives: Buttons (5), Inputs (4), Typography (6), Badges (4), Alerts (4)
- Composites: Card, Sidebar Nav, Table, Tabs, Breadcrumbs, Pagination, Modal, Dropdown, Avatar, Divider, Switch, Checkbox, Radio

**Patterns:** 4 composition showcases
1. Form Pattern — contact/login form with validation layout
2. Data Display — table with pagination and actions
3. Navigation — sidebar + breadcrumbs + tabs app shell
4. Card Layout — responsive feature/product grid

**Screens:** [count] domain screens
1. [Screen name] — [brief description]
2. [Screen name] — [brief description]
3. [Screen name] — [brief description]
...

### Screenshots
[Include get_screenshot results for key screens]

### Next Steps
- Customize component text and imagery for your specific brand
- Add additional screens as needed using the component library
- Toggle between light and dark themes to verify both modes
- Export to code using Pencil's code generation tools
```

---

## Pre-Flight Checklist (Quick Reference)

Run through before declaring the design system complete:

- [ ] Canvas has 4 organized sections (Foundations → Components → Patterns → Screens)
- [ ] Foundations has all 5 documentation frames with correct swatches/specimens
- [ ] No orphan components at document root (all under Components section)
- [ ] Components organized under category sub-frames with titles
- [ ] All 4 pattern showcases present and using component refs
- [ ] All screens rendered correctly in `get_screenshot`
- [ ] `snapshot_layout({ problemsOnly: true })` returns no issues
- [ ] `search_all_unique_properties` shows only `$--` tokens for colors
- [ ] `search_all_unique_properties` shows only `$--font-*` for fonts
- [ ] `search_all_unique_properties` shows only `$--text-*` token values for font sizes
- [ ] Component count matches expected (~25+)
- [ ] All screens use `ref` instances (no inline component recreation)
- [ ] All text content is domain-appropriate (no lorem ipsum)
- [ ] Images are domain-relevant
- [ ] Light and dark theme tokens are both defined
- [ ] Screen names are descriptive
- [ ] Component names follow `Category/Variant` pattern
- [ ] Navigation index frame present with section coordinates
