# Video Tutorial

## Design series

### Video 1: Global Text Color Variable (~2 min)

Intro (0:00–0:10)“Let’s set up a global text style so our typography stays consistent.”
Figma (0:10–1:30)

- Select a text element.
- Apply a fill color (neutral).
- Save it as a Color Style: “Text / Neutral”.
- Apply this style to multiple text layers.
- Quickly change the style → all instances update.

Recap (1:30–2:00)“Now our text colors are managed globally. One update fixes everything.”

### Video 2: UI Depth with Canvas & Surface (~2 min)

Intro (0:00–0:10)“Here’s how to use canvas and surface styles for depth in your designs.”
Figma (0:10–1:30)

- Show a page frame with a Canvas background style.
- Add a card on top → apply Surface color style.
- Duplicate card, change to Surface / Elevated for hierarchy.
- Brief zoom-out to show depth visually.

Recap (1:30–2:00)“Canvas for base, Surface for elevated elements -- a clear visual structure.”

### Video 3: Chip Variants (~2 min)

Intro (0:00–0:10)“Now we’ll style Chips using color variants.”
Figma (0:10–1:30)

- Select base chip component.
- Apply Success, Info, Danger, Warning, Neutral color styles as fills.
- Show them side by side.
- Rename variants in the component panel.

Recap (1:30–2:00)“All Chip variants are linked to styles -- easy to swap and consistent.”

### Video 4: Tab Component with Hover + Active States (~2 min)

Intro (0:00–0:10)“Let’s style Tab states directly in Figma.”
Figma (0:10–1:30)

- Show default Tab with Text / Neutral.
- Create a Hover variant → background set to Surface / Subtle.
- Create an Active variant → accent border + bold text style.
- Preview in prototype mode to show interaction.

Recap (1:30–2:00)“Our Tabs now communicate state visually: neutral, hover, and active.”

### Video 5: Button Variants + States (~2 min)

Intro (0:00–0:10)“Finally, let’s style our Buttons with variants and states.”
Figma (0:10–1:30)

- Base button: neutral background + text.
- Create variants:
  - Primary (accent background, white text)
  - Secondary (neutral border, neutral text)
  - Tertiary (text only)
- Add hover and active states by duplicating variants and swapping fills.
- Organize with Variant Properties.

Recap (1:30–2:00)“Now our Button system is complete, fully powered by shared color styles.”

Total: ~10 minutes across 5 videos

- Perfect balance with the developer series.
- Designers see how to manage tokens and variants visually in Figma.
- Developers see how to implement the same tokens in code.

## Developer series

### Video 1: Global Text Color Variable (~2 min)

Intro (0:00–0:10)“Let’s set up a global text color variable so all text updates consistently.”
Figma DevMode (0:10–0:25)

- Highlight text color in DevMode.
- “Our base text uses neutral color. By defining it globally, any update will cascade.”

Code (0:25–1:30)

- Show :root { --color-text-neutral: #... }.
- Apply it in a text component: color: var(--color-text-neutral);.
- Show quick example: changing the variable updates multiple text elements.

Result + Recap (1:30–2:00)“Now we’ve got one source of truth for text color, easy to maintain and update.”

### Video 2: UI Depth with Canvas & Surface (~2 min)

Intro (0:00–0:10)“In this video, we’ll apply canvas and surface colors to create depth.”
Figma DevMode (0:10–0:25)

- Show background layers in design.
- “Notice the page uses a canvas background, while cards use surface. There is also a third option for floating content that is placed on top of everything like popup menus and dialogs”

Code (0:25–1:30)

- Apply canvas: background: var(--color-canvas);.
- Apply surface for sidebar,tab-bar and table: background: var(--color-surface);.

Result + Recap (1:30–2:00)“Canvas for base, surface for sections with content and floating for elements on top of everything -- clear hierarchy, minimal effort.”

### Video 3: Chip Variants (Success, Info, Danger, Warning, Neutral) (~2 min)

Intro (0:00–0:10)“Now let's style the Chip component with color variants.”
Figma DevMode (0:10–0:25)

- Highlight each chip color in DevMode.
- “We've got success, info, danger, warning, and neutral.”

Code (0:25–1:30)

- Show variant classes like .chip.success, .chip.info, etc.
- Apply background + text:.chip.success { background: var(--color-success-bg); color: var(--color-success-text); }
- Repeat briefly for other variants.

Result + Recap (1:30–2:00)“All five variants are consistent with our color tokens, ready to use in UI.”

### Video 4: Tab Component with Hover + Active States (~2 min)

Intro (0:00–0:10)“Let's style our Tab component with hover and active states.”
Figma DevMode (0:10–0:25)

- Highlight neutral text, hover background, and active border in DevMode.

Code (0:25–1:30)

- Default text: color: var(--color-text-neutral);.
- Hover: background surface + stronger text.
- Active: accent border + bold text.

Result + Recap (1:30–2:00)“Our Tab now matches the design: neutral base, subtle hover, accent active.”

### Video 5: Button Variants + States (~2 min)

Intro (0:00–0:10)“Last one -- let's style Buttons with variants and states.”
Figma DevMode (0:10–0:25)

- Show primary, secondary, tertiary in DevMode.
- Point out hover + active styles.

Code (0:25–1:30)

- Base button: padding, border, neutral text.
- Add color tokens:
  - Primary: accent background + white text.
  - Secondary: neutral border + text.
  - Tertiary: text only.
- Add hover/active states: darken, lighten, or add subtle shadow.

Result + Recap (1:30–2:00)“All three variants now support accent, neutral, and danger colors -- consistent across states.”

Total series runtime: ~10 minutes

- Each video is a self-contained, fast lesson.
- Together, they show a clear progression: global → layout depth → simple component → interactive states → full button system.
