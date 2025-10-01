# Video Tutorials

Concise walkthroughs for designers and developers. Five videos per series (~2 minutes each). Total runtime: ~10 minutes per series.

## Design series

### Video 1: Global Text Colour Variable (~2 min)

**Intro (0:00–0:10)**  
Create a global text style for consistent typography.

**Figma (0:10–1:30)**

- Select a text element.
- Apply a neutral fill colour.
- Save it as a Colour Style: Text / Neutral.
- Apply the style across multiple text layers.
- Change the style once — all instances update.

**Recap (1:30–2:00)**  
One update now controls all text colours.

### Video 2: UI Depth with Canvas & Surface (~2 min)

**Intro (0:00–0:10)**  
Use canvas and surface styles to show depth.

**Figma (0:10–1:30)**

- Page frame: apply Canvas background.
- Add a card: apply Surface.
- Duplicate and set to Surface / Elevated for hierarchy.
- Zoom out to show perceived depth.

**Recap (1:30–2:00)**  
Canvas = base. Surface = elevation. Clear structure.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Apply colour variants to Chips.

**Figma (0:10–1:30)**

- Select the base chip component.
- Apply Success, Info, Danger, Warning, and Neutral styles.
- Show variants side by side.
- Rename variants for clarity.

**Recap (1:30–2:00)**  
All variants use shared styles — easy to maintain.

### Video 4: Tab Component (Hover + Active) (~2 min)

**Intro (0:00–0:10)**  
Define tab interaction states.

**Figma (0:10–1:30)**

- Default: Text / Neutral.
- Hover variant: Surface / Subtle background.
- Active variant: accent border + bold text.
- Preview in prototype mode.

**Recap (1:30–2:00)**  
States now read clearly: neutral → hover → active.

### Video 5: Button Variants + States (~2 min)

**Intro (0:00–0:10)**  
Build a button system with variants and states.

**Figma (0:10–1:30)**

- Base: neutral background + text.
- Add variants:
  - Primary: accent background, white text.
  - Secondary: neutral border, neutral text.
  - Tertiary: text only.
- Add hover and active states (swap fills / adjust emphasis).
- Organise with Variant Properties.

**Recap (1:30–2:00)**  
Reusable system powered by shared colour styles.

**Series summary**

- Mirrors the developer series.
- Designers learn token + variant management.
- Foundation for implementation in code.

## Developer series

### Video 1: Global Text Colour Variable (~2 min)

**Intro (0:00–0:10)**  
Define one variable for all neutral text.

**Figma DevMode (0:10–0:25)**

- Inspect the neutral text colour.
- Centralising it ensures cascading updates.

**Code (0:25–1:30)**

- `:root { --colour-text-neutral: #...; }`
- Apply: `color: var(--colour-text-neutral);`
- Change once — many elements update.

**Result (1:30–2:00)**  
Single source of truth for text colour.

### Video 2: UI Depth with Canvas & Surface (~2 min)

**Intro (0:00–0:10)**  
Separate structural layers visually.

**Figma DevMode (0:10–0:25)**

- Page uses canvas.
- Cards and content containers use surface.
- Floating elements (menus, dialogues) sit above both.

**Code (0:25–1:30)**

- Base layout: `background: var(--colour-canvas);`
- Content sections (sidebar, tab bar, table): `background: var(--colour-surface);`
- Floating layer (where needed): elevated style token.

**Result (1:30–2:00)**  
Clear depth with minimal CSS.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Implement success, info, danger, warning, neutral.

**Figma DevMode (0:10–0:25)**

- Inspect each token pair.

**Code (0:25–1:30)**

- Example:  
  `.chip.success { background: var(--colour-success-bg); color: var(--colour-success-text); }`
- Repeat for info, danger, warning, neutral.

**Result (1:30–2:00)**  
All variants aligned with tokens.

### Video 4: Tab Component States (~2 min)

**Intro (0:00–0:10)**  
Add hover and active behaviour.

**Figma DevMode (0:10–0:25)**

- Review neutral text, hover background, active accent.

**Code (0:25–1:30)**

- Default: `color: var(--colour-text-neutral);`
- Hover: subtle surface background + stronger text (if required).
- Active: accent border + bold text.

**Result (1:30–2:00)**  
State cues: predictable and accessible.

### Video 5: Button Variants + States (~2 min)

**Intro (0:00–0:10)**  
Implement core variants.

**Figma DevMode (0:10–0:25)**

- Inspect primary, secondary, tertiary and their states.

**Code (0:25–1:30)**

- Base: structural padding, neutral text.
- Primary: accent background + white text.
- Secondary: neutral border + text.
- Tertiary: text only.
- Add hover / active: shade shift or subtle shadow.

**Result (1:30–2:00)**  
Variants support accent, neutral, danger tokens consistently.

**Series summary**

- Fast, focused lessons.
- Builds concept chain: global → depth → variants → states → system.

---

Both series reinforce shared design tokens and implementation patterns.
