# Video Tutorials

Concise walkthroughs for designers and developers. Four videos per series (~2–2.5 minutes each). Total runtime per series: ~9 minutes.

This script uses the current semantic colour system vocabulary (Canvas, Surface, Floating, Fill Muted, Fill Emphasis, Text strong, Text subtle, Text strong on emphasis, Text subtle on emphasis, Border tiers, Focus) from the foundation docs (`about.md`, `getting-started.md`). It is defined to works with both implementation strategies:

- Dynamic approach: abstract semantic roles resolved through an appearance attribute (for example `data-color-appearance`).
- Static approach: category‑specific semantic tokens (Neutral / Accent / Success / Info / Warning / Danger) referenced directly.

Angle‑bracket placeholders (e.g. `<Text-Neutral-Strong>`, `<Bg-Canvas>`, `<Bg-Fill-Emphasis-Hover>`, `<Border-Focus>`) must be replaced with your real token references (CSS variable names, design token IDs, or theme object lookups). No concrete variable names are embedded here to avoid binding the script to one strategy.

---

## Design series

### Video 1: UI Layers & Global Text (Canvas, Surface, Floating + Text) (~2–2.5 min)

**Intro (0:00–0:15)**  
Apply background depth using canvas, surface, floating backgrounds and apply the global default text.

**Figma (0:15–1:50)**

Text role setup:

- Select representative body text, table cells, and any headings sharing the primary colour.
- Apply semantic style: Text / Neutral / Strong.
- Bulk‑apply to all matching textual elements.

Layer setup:

- Root frame / page background: `<Bg-Canvas>`.
- Primary content containers / panels: `<Bg-Surface>`.
- Elevated overlays (tooltip, dropdown, modal shell): `<Bg-Floating>`.
- Quickly toggle theme / appearance to demonstrate automatic adaptation (no manual recolouring).

Validation:

- Contrast check body text against Canvas & Surface.
- Ensure overlays remain distinct over underlying surfaces.

**Recap (1:50–2:30)**  
One text role + three background layers establish global readability and depth.

### Video 2: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Map status variants using Fill Muted, Text Subtle and border strong roles per category.

**Figma (0:10–1:30)**

- Create a neutral chip
- Duplicate for info / success / warning / danger
- Show state for default, hover and active

**Recap (1:30–2:00)**  
Consistent variable structure.

### Video 3: Tabs & States (~2 min)

**Intro (0:00–0:10)**  
Use semantic roles for default, hover, and selected tab.

**Figma (0:10–1:30)**

- Default label: `<Text-Neutral-Strong>`.
- Hover container (if used): `<Bg-Neutral-Fill-Muted-Hover>`.
- Active indicator: `<Border-Accent-Strong>` (or `<Border-*-Strong>` if category‑driven).
- Demonstrate switching appearance (dynamic) vs swapping category token (static).

**Recap (1:30–2:00)**  
Interaction is described by stateful semantic roles—no manual colour overrides.

### Video 4: Button Variants & States (~2 min)

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

Same four concepts; emphasise implementation and placeholder substitution.

### Video 1: UI Layers & Global Text (Canvas, Surface, Floating + Text) (~2–2.5 min)

**Intro (0:00–0:15)**  
Define global text + depth layers together for a minimal, high‑impact semantic foundation.

**Code (0:15–1:45)**

```css
/* Global text role */
body,
p,
td,
th {
  color: <Text-Neutral-Strong>;
}

/* Depth layers */
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

Implementation notes:

- Dynamic: appearance switch remaps all four roles automatically.
- Static: placeholders point directly to category tokens.
- Accessibility: verify contrast for `<Text-Neutral-Strong>` on both `<Bg-Canvas>` and `<Bg-Surface>`.

**Recap (1:45–2:30)**  
Four foundational roles (one text + three backgrounds) remove duplication and simplify future theming.

### Video 2: Chip Variants (~2 min)

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

### Video 3: Tabs & States (~2 min)

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

### Video 4: Button Variants & States (~2 min)

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

Concept progression: UI Layers & Global Text → Variants → States → Composite Component.

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
