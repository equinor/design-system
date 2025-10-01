# Video Tutorials

Concise walkthroughs for designers and developers. Five videos per series (~2 minutes each). Total runtime per series: ~10 minutes.

This script uses the current semantic colour system vocabulary (Canvas, Surface, Floating, Fill Muted, Fill Emphasis, Text strong, Text subtle, Text strong on emphasis, Text subtle on emphasis, Border tiers, Focus) from the foundation docs (`about.md`, `getting-started.md`). It is defined to works with both implementation strategies:

- Dynamic approach: abstract semantic roles resolved through an appearance attribute (for example `data-color-appearance`).
- Static approach: category‑specific semantic tokens (Neutral / Accent / Success / Info / Warning / Danger) referenced directly.

Angle‑bracket placeholders (e.g. `<Text-Neutral-Strong>`, `<Bg-Canvas>`, `<Bg-Fill-Emphasis-Hover>`, `<Border-Focus>`) must be replaced with your real token references (CSS variable names, design token IDs, or theme object lookups). No concrete variable names are embedded here to avoid binding the script to one strategy.

---

## Design series

### Video 1: Global Text Role (~2 min)

**Intro (0:00–0:10)**  
Define a single semantic role for primary body text: Neutral → Text → Strong.

**Figma (0:10–1:30)**

- Select representative text (paragraph / table cell).
- Apply semantic style: Text / Neutral / Strong.
- (Optional) Save as a shared style / variable alias.
- Apply across headings (if appropriate), body copy, data cells.
- Change once to update everywhere (propagation demo).

**Recap (1:30–2:00)**  
One role centralises primary textual colour. No hex duplication.

### Video 2: Depth Layers (Canvas, Surface, Floating) (~2 min)

**Intro (0:00–0:10)**  
Establish visual depth layers with background roles.

**Figma (0:10–1:30)**

- Root frame / page: `<Bg-Canvas>`.
- Primary content panels / cards: `<Bg-Surface>`.
- Elevated overlays (tooltip / dropdown / modal shell): `<Bg-Floating>`.
- Show quick theme / appearance toggle: layers adapt without editing each object.

**Recap (1:30–2:00)**  
Layer semantics drive depth—switch theme once, all layers resolve correctly.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Map status variants using Fill Muted + Text Strong roles per category.

**Figma (0:10–1:30)**

- Create a neutral chip: background `<Bg-Neutral-Fill-Muted-Default>` + text `<Text-Neutral-Strong>`.
- Duplicate for success / info / warning / danger: only swap category prefix.
- (Optional) Show hover token placeholder: `<Bg-*-Fill-Muted-Hover>`.
- Confirm consistent padding / typography unaffected by colour changes.

**Recap (1:30–2:00)**  
Consistent structure; variant identity lives in semantic colour selection only.

### Video 4: Tabs & States (~2 min)

**Intro (0:00–0:10)**  
Use semantic roles for default, hover, and selected tab.

**Figma (0:10–1:30)**

- Default label: `<Text-Neutral-Strong>`.
- Hover container (if used): `<Bg-Neutral-Fill-Muted-Hover>`.
- Active indicator: `<Border-Accent-Strong>` (or `<Border-*-Strong>` if category‑driven).
- Demonstrate switching appearance (dynamic) vs swapping category token (static).

**Recap (1:30–2:00)**  
Interaction is described by stateful semantic roles—no manual colour overrides.

### Video 5: Button Variants & States (~2 min)

**Intro (0:00–0:10)**  
Compose base + primary + secondary + tertiary buttons with Fill Muted / Fill Emphasis / Surface + Focus border tokens.

**Figma (0:10–1:00)**

- Base: `<Bg-Neutral-Fill-Muted-Default>` + `<Text-Neutral-Strong>`.
- Primary: `<Bg-Accent-Fill-Emphasis-Default>` + `<Text-Accent-Strong-on-Emphasis>`.
- Secondary: `<Bg-Neutral-Surface>` + `<Border-Neutral-Medium>` + `<Text-Neutral-Strong>`.
- Tertiary: transparent background + `<Text-Neutral-Strong>` + optional muted hover fill.
- States: Hover / Active use the corresponding `-Hover` / `-Active` tokens.
- Focus ring: `<Border-Focus>`.

**Prototype (1:00–1:30)**  
Switch theme or appearance once—every button resolves to correct colours.

**Recap (1:30–2:00)**  
Variant + state logic expressed entirely through semantic roles; design remains portable.

---

## Developer series

Same five concepts; emphasise implementation and substitution of placeholders.

### Video 1: Global Text Role (~2 min)

**Intro (0:00–0:10)**  
Establish `<Text-Neutral-Strong>` as a single source.

**Code (0:10–1:20)**

```css
/* Replace placeholders with your real tokens */
body,
p,
td,
th {
  color: <Text-Neutral-Strong>;
}
```

- Dynamic: `<Text-Neutral-Strong>` points to an abstract semantic layer resolved by appearance.
- Static: placeholder maps directly to a category-specific variable.

**Recap (1:20–2:00)**  
Central definition removes scattered overrides.

### Video 2: Depth Layers (Canvas, Surface, Floating) (~2 min)

**Intro (0:00–0:10)**  
Apply Canvas / Surface / Floating container roles.

**Code (0:10–1:20)**

```css
html {
  background: <Bg-Canvas>;
}
main {
  background: <Bg-Surface>;
}
[data-floating] {
  background: <Bg-Floating>;
}
```

- Dynamic: switching `data-color-appearance` (or theme root) remaps all three.
- Static: each placeholder is a fixed semantic token.

**Recap (1:20–2:00)**  
Depth changes by semantic remap—not manual find/replace.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Generate category variants by prefix substitution.

**Code (0:10–1:20)**

```css
.chip {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font: 0.75rem/1.2 inherit;
}
.chip.success {
  background: <Bg-Success-Fill-Muted-Default>;
  color: <Text-Success-Strong>;
}
.chip.info {
  background: <Bg-Info-Fill-Muted-Default>;
  color: <Text-Info-Strong>;
}
.chip.warning {
  background: <Bg-Warning-Fill-Muted-Default>;
  color: <Text-Warning-Strong>;
}
.chip.danger {
  background: <Bg-Danger-Fill-Muted-Default>;
  color: <Text-Danger-Strong>;
}
.chip.neutral {
  background: <Bg-Neutral-Fill-Muted-Default>;
  color: <Text-Neutral-Strong>;
}
```

- Optional hover: replace `-Default` with `-Hover`.

**Recap (1:20–2:00)**  
Structural CSS stays identical; only semantic placeholders change.

### Video 4: Tabs & States (~2 min)

**Intro (0:00–0:10)**  
Express default / hover / selected through semantic tokens.

**Code (0:10–1:20)**

```css
.tab {
  color: <Text-Neutral-Strong>;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
}
.tab:hover {
  background: <Bg-Neutral-Fill-Muted-Hover>;
}
.tab[aria-selected="true"] {
  border-bottom-color: <Border-Accent-Strong>;
  font-weight: 600;
}

/* Dynamic appearance variant */
[data-color-appearance="accent"] .tab[aria-selected="true"] {
  border-bottom-color: <Border-Strong>;
}
```

**Recap (1:20–2:00)**  
No raw hex; state logic isolated to semantic roles.

### Video 5: Button Variants & States (~2 min)

**Intro (0:00–0:10)**  
Combine variant + interaction + focus semantics.

**Code (0:10–1:30)**

```css
.button {
  padding: 0.5rem 0.75rem;
  font: inherit;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
}

/* Base */
.button.base {
  background: <Bg-Neutral-Fill-Muted-Default>;
  color: <Text-Neutral-Strong>;
}
.button.base:hover {
  background: <Bg-Neutral-Fill-Muted-Hover>;
}
.button.base:active {
  background: <Bg-Neutral-Fill-Muted-Active>;
}

/* Primary */
.button.primary {
  background: <Bg-Accent-Fill-Emphasis-Default>;
  color: <Text-Accent-Strong-on-Emphasis>;
  border-color: <Bg-Accent-Fill-Emphasis-Default>;
}
.button.primary:hover {
  background: <Bg-Accent-Fill-Emphasis-Hover>;
}
.button.primary:active {
  background: <Bg-Accent-Fill-Emphasis-Active>;
}

/* Secondary */
.button.secondary {
  background: <Bg-Neutral-Surface>;
  color: <Text-Neutral-Strong>;
  border-color: <Border-Neutral-Medium>;
}
.button.secondary:hover {
  background: <Bg-Neutral-Fill-Muted-Hover>;
}
.button.secondary:active {
  background: <Bg-Neutral-Fill-Muted-Active>;
}

/* Tertiary */
.button.tertiary {
  background: transparent;
  color: <Text-Neutral-Strong>;
}
.button.tertiary:hover {
  background: <Bg-Neutral-Fill-Muted-Hover>;
}
.button.tertiary:active {
  background: <Bg-Neutral-Fill-Muted-Active>;
}

/* Dynamic appearance (optional) */
.button[data-color-appearance] {
  background: <Bg-Fill-Emphasis-Default>;
  color: <Text-Strong-on-Emphasis>;
  border-color: <Bg-Fill-Emphasis-Default>;
}
.button[data-color-appearance]:hover {
  background: <Bg-Fill-Emphasis-Hover>;
}
.button[data-color-appearance]:active {
  background: <Bg-Fill-Emphasis-Active>;
}

/* Focus & Disabled */
.button:focus-visible {
  outline: 2px solid <Border-Focus>;
  outline-offset: 2px;
}
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Recap (1:30–2:00)**  
Every variant + state uses an explicit semantic placeholder; switching strategy (dynamic vs static) only changes the mapping layer.

---

## Series summary (applies to both)

Concept progression: Global Text → Depth → Variants → States → Composite Component.

Key principles reinforced:

- Single source semantics (avoid literal colour repetition).
- Consistent naming across design & code.
- Appearance / theme switching without refactoring components.
- State tokens (Default / Hover / Active / Focus) are first-class.
- Category vs abstract appearance is an implementation decision—keep roles stable.

Implementation reminder:

- Pick ONE strategy per project (dynamic OR static) to avoid drift.
- Replace all `<Placeholder>` entries with your actual token identifiers.
- Validate contrast (APCA) after substitution—semantics do not guarantee adequacy without final contrast checks.

Optional next steps:

- Add a mapping table (Placeholder → Token Reference) in internal docs.
- Automate lint rules to disallow raw hex in component styles.

---

Both series share the same semantic model. The only difference at implementation time is how placeholders are resolved. Keep this file unchanged except for future vocabulary updates—do not reintroduce concrete token names here.
