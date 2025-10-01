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
Use canvas and surface colours to show depth and hierarchy.

**Figma (0:10–1:30)**

- Dashboard element: apply Canvas background.
- Sidebar, Tab bar and Table: apply Surface.
- Menu: apply the Floating concept colour

**Recap (1:30–2:00)**  
Canvas = base background of your application to create depth and hierarchy.
Surface = content background that sits on top of canvas. Clear structure.
Floating = elements that are placed closest to the viewer and sits above both canvas and surface.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Apply colour to chip variants.

**Figma (0:10–1:30)**

- Select the base chip component.
- Apply Success, Info, Danger, Warning, and Neutral styles.
- Show variants side by side.

**Recap (1:30–2:00)**  
We are supporting common system state colours.

### Video 4: Tab Component (Hover + Active) (~2 min)

**Intro (0:00–0:10)**  
Define tab interaction states.

**Figma (0:10–1:30)**

- Default: Text / Neutral.
- Hover variant: Text / Subtle background.
- Active variant: accent border + bold text.

**Recap (1:30–2:00)**  
States now read clearly: default → hover → active.

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

- Page: apply Canvas (base background).
- Content containers (sidebar, tab bar, table): apply Surface.
- Floating elements (menus, dialogues): Floating concept colour (sits above both).

**Code (0:25–1:30)**

- Base layout: `background: var(--colour-canvas);`
- Content sections (sidebar, tab bar, table): `background: var(--colour-surface);`
- Floating layer (menus, overlays): elevated / floating token styles.

**Result (1:30–2:00)**  
Clear depth with minimal CSS.

### Video 3: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Implement success, info, danger, warning, neutral.

**Figma DevMode (0:10–0:25)**

- Inspect each token pair (background + text).

**Code (0:25–1:30)**

- Example:
  `.chip.success { background: var(--colour-success-bg); color: var(--colour-success-text); }`
- Repeat for info, danger, warning, neutral using their token pairs.

**Result (1:30–2:00)**  
All variants aligned with shared system state colour tokens.

### Video 4: Tab Component States (~2 min)

**Intro (0:00–0:10)**  
Add hover and active behaviour.

**Figma DevMode (0:10–0:25)**

- Review neutral text, subtle hover background, active accent (border + bold text).

**Code (0:25–1:30)**

- Default:
  `.tab { color: var(--colour-text-neutral); border-bottom: 2px solid transparent; }`
- Hover:
  `.tab:hover { background: var(--colour-surface-subtle-hover); }`
- Active:
  `.tab[aria-selected="true"] { border-bottom: 2px solid var(--colour-accent-border); font-weight: 600; }`

**Result (1:30–2:00)**  
State cues: predictable and accessible.

### Video 5: Button Variants + States (~2 min)

**Intro (0:00–0:10)**  
Implement core variants.

**Figma DevMode (0:10–0:25)**

- Inspect base, primary, secondary, tertiary tokens + hover / active states.

**Code (0:25–1:30)**

- Base:
  `.button { padding: var(--space-2) var(--space-3); font: inherit; border-radius: var(--radius-sm); }`
- Primary:
  `.button.primary { background: var(--colour-accent-bg); color: var(--colour-text-on-accent); border: 1px solid var(--colour-accent-bg); }`
  `.button.primary:hover { background: var(--colour-accent-bg-hover); }`
  `.button.primary:active { background: var(--colour-accent-bg-active); }`
- Secondary:
  `.button.secondary { background: var(--colour-surface); color: var(--colour-text-neutral); border: 1px solid var(--colour-border-neutral); }`
  `.button.secondary:hover { background: var(--colour-surface-hover); }`
  `.button.secondary:active { background: var(--colour-surface-active); }`
- Tertiary:
  `.button.tertiary { background: transparent; color: var(--colour-text-neutral); border: 1px solid transparent; }`
  `.button.tertiary:hover { background: var(--colour-surface-subtle-hover); }`
  `.button.tertiary:active { background: var(--colour-surface-subtle-active); }`
- Focus outline (shared):
  `.button:focus-visible { outline: 2px solid var(--colour-focus-ring); outline-offset: 2px; }`
- Disabled state (shared):
  `.button:disabled { opacity: .5; cursor: not-allowed; }`

Organise in code with a variant class + shared base styles for consistency.

**Result (1:30–2:00)**  
Reusable system powered by shared colour styles.

**Series summary**

- Mirrors the design series.
- Fast concept chain: global → depth → variants → states → system.
- Reinforces shared tokens & implementation patterns.

---

Both series reinforce shared design tokens and implementation patterns.
