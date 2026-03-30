# Create EDS Component in Figma

$ARGUMENTS

Create an EDS 2.0 component directly in Figma with proper design token (variable) bindings using the Figma MCP server's `use_figma` tool. All colours, spacing, typography, and border values must be bound to EDS library variables — never hardcode values.

## When to Use

- User wants to create or recreate an EDS component in Figma with proper token bindings
- User wants to push a code component's visual design into Figma
- User wants to scaffold a new Figma component that follows EDS token architecture

## Prerequisites

- Figma MCP server must be connected and authenticated
- Target Figma file must have EDS token libraries enabled (EDS Primitives + EDS Tokens)
- You MUST invoke the `figma-use` skill before EVERY `use_figma` tool call

---

## Phase 1: Gather Inputs

Parse `$ARGUMENTS` for:

1. **Component name** (required) — e.g. "Button", "Chip", "Avatar"
2. **Target Figma file URL** (optional) — if not provided, **ask the user**

If the component exists in the codebase at `packages/eds-core-react/src/components/next/{ComponentName}/`:

- Read `.tsx`, `.types.ts`, and `.css` files to understand structure, props, and variants
- Extract CSS token usage — grep for `--eds-` patterns in the CSS file
- Note which `data-*` attributes are used (`data-color-appearance`, `data-selectable-space`, `data-space-proportions`, `data-font-size`, `data-font-family`, `data-baseline`, `data-line-height`)
- These data-attributes map directly to Figma variable modes (see Phase 4)

If no code exists, ask the user for a description of the component's structure and intended tokens.

---

## Phase 2: Discover EDS Tokens in Figma

### 2a. Check for existing components

Call `search_design_system("{ComponentName}")` to check if the component already exists in the connected EDS libraries. If found, ask the user whether to recreate, update, or use as reference.

### 2b. Discover available variables

**Preferred method**: Use `use_figma` with the Plugin API `teamLibrary` to discover available library variable collections and their variables programmatically. This is more reliable than `get_variable_defs` (which requires a node to be selected).

```js
const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
const results = []
for (const col of collections) {
  const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(col.key)
  results.push({
    name: col.name, key: col.key, libraryName: col.libraryName,
    varCount: vars.length,
    sampleVars: vars.slice(0, 15).map(v => v.name)
  })
}
return results
```

**Fallback**: Call `get_variable_defs` on the target file (select an existing frame or component that uses EDS variables) to get the current variable names, IDs, and collection structure.

If the file has no EDS variables available, the user may need to enable the EDS libraries in Figma first. Inform the user: "The target file needs the EDS token libraries enabled. In Figma, go to Assets panel > Team library > Enable 'EDS Tokens' and 'EDS Primitives'."

### 2c. What to look for in the response

The `get_variable_defs` response includes variables grouped by collection. The EDS collections are:

| Collection | Contains | Used For |
|---|---|---|
| EDS Colours (dynamic) | `Bg/Fill/Emphasis/Default`, `Text/Strong`, `Border/Subtle`, etc. | Colour tokens that respond to appearance mode changes |
| EDS Colours (static) | `Bg/Accent/Fill Muted/Default`, `Text/Neutral/Strong`, etc. | Colour tokens with semantic intent baked into the name |
| EDS Colours (concept) | `Bg/Floating`, `Border/Focus`, `Text/Link`, etc. | Cross-cutting colour tokens (same in all appearance modes) |
| EDS Spacing & Typography | `Selectable/Space horizontal`, `Typography/Font size`, `Generic/Corner radius`, etc. | Spacing, typography, border, and layout tokens |

---

## Phase 3: Plan the Component Structure

Map the component's structure to Figma layers. Translate React JSX hierarchy to Figma's frame/text/component hierarchy:

```
ComponentSet (if the component has variants)
├── Variant: property1=value1, property2=value2
│   └── Component (auto layout frame)
│       ├── Fill → bound to Bg colour variable
│       ├── Stroke → bound to Border colour variable
│       ├── Corner Radius → bound to Generic/Corner radius
│       ├── Padding → bound to Selectable/Space horizontal + vertical
│       ├── Gap → bound to Selectable/Icon + text gap ↔︎
│       ├── Icon Frame (if applicable)
│       │   └── Size → bound to Selectable/Icon size
│       └── Label (Text node) — ALL 6 typography props variable-bound
│           ├── fills → Text colour variable (via setBoundVariableForPaint)
│           ├── fontSize → Typography/Font size (via setBoundVariable)
│           ├── fontFamily → Typography/Font family (via setBoundVariable)
│           ├── fontWeight → Typography/Font weight (via setBoundVariable)
│           ├── lineHeight → Typography/Line height (via setBoundVariable)
│           └── letterSpacing → Typography/Tracking (via setBoundVariable)
└── Variant: property1=value2, ...
```

For simple components without variants, create a single Component (not ComponentSet).

### Data-Attribute to Figma Mode Mapping

In code, `data-*` attributes control which token values resolve. In Figma, this is done via variable modes set on frames:

| Code Attribute | Figma Mechanism | Values |
|---|---|---|
| `data-color-appearance` | Appearance mode on frame | Neutral, Accent, Info, Success, Warning, Danger |
| `data-color-scheme` | Colour Scheme mode on frame | Light, Dark |
| `data-selectable-space` | Selectable Space mode on frame | XS, SM, MD, LG, XL |
| `data-space-proportions` | Space Proportions mode on frame | Squished, Squared, Stretched |
| `data-font-family` | Font Family mode on frame | Header, UI and Body |
| `data-font-size` | Font Size mode on frame | XS, SM, MD, LG, XL, 2XL–6XL |
| `data-font-weight` | Font Weight mode on frame | Lighter, Normal, Bolder |
| `data-line-height` | Line Height mode on frame | Default, Squished |
| `data-tracking` | Tracking mode on frame | Tight, Normal, Wide, Loose |
| `data-baseline` | Font Baseline mode on frame | Centred, Baselined |

**IMPORTANT**: Modes are set on FRAMES, not individual layers. All child nodes inherit the mode from their parent frame.

---

## Phase 4: Create Component in Figma (Chunked)

CRITICAL: You MUST invoke the `figma-use` skill before EVERY `use_figma` tool call.

### Chunking Strategy

The `use_figma` tool has a 20KB response limit. Break complex components into logical chunks:

**Chunk 1 — Structure**: Create the component/component-set frame(s), set auto layout, add child frames and text nodes. Name all nodes clearly. Return created node IDs.

**Chunk 2 — Colour bindings**: Import EDS colour variables from the library and bind them to fills, strokes, and text fills on created nodes.

**Chunk 3 — Spacing and typography bindings**: Import spacing and typography variables, bind to padding, gap, corner radius, font size, font family, line height, tracking, font weight.

**Chunk 4 — Modes**: Set explicit variable modes on frames (appearance, colour scheme, density, font size, etc.).

**Chunk 5 — Additional variants** (if needed): Create additional variant frames (Hover, Focus, Active, Disabled) with their respective state-specific tokens.

For simple components (single frame, few child elements), combine chunks 1–4 into a single `use_figma` call.

### Auto Layout Mapping

Translate CSS flexbox to Figma auto layout:

| CSS Property | Figma Auto Layout Property |
|---|---|
| `display: flex; flex-direction: row` | `layoutMode = "HORIZONTAL"` |
| `display: flex; flex-direction: column` | `layoutMode = "VERTICAL"` |
| `align-items: center` | `counterAxisAlignItems = "CENTER"` |
| `justify-content: center` | `primaryAxisAlignItems = "CENTER"` |
| `justify-content: space-between` | `primaryAxisAlignItems = "SPACE_BETWEEN"` |
| `gap: <token>` | `itemSpacing` bound to gap variable |
| `padding: <token>` | `paddingTop/Right/Bottom/Left` bound to spacing variables |
| `width: fit-content` | `primaryAxisSizingMode = "AUTO"` |
| `width: 100%` (in flex child) | `layoutGrow = 1` or `layoutSizingHorizontal = "FILL"` |
| `flex-shrink: 0` | `layoutSizingHorizontal = "FIXED"` |

### Variable Binding Patterns

When writing `use_figma` Plugin API code, use these patterns:

**Import a library variable:**
```js
// 1. Find available library collections
const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
const edsCollection = collections.find(c => c.name.includes('EDS'))

// 2. Get variables in the collection
const libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(edsCollection.key)

// 3. Import a specific variable by name
const varRef = libVars.find(v => v.name === 'Bg/Fill/Emphasis/Default')
const variable = await figma.variables.importVariableByKeyAsync(varRef.key)
```

**Bind colour to fill:**
```js
const paintCopy = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
const boundPaint = figma.variables.setBoundVariableForPaint(paintCopy, 'color', variable)
node.fills = [boundPaint]
```

**Bind colour to stroke:**
```js
const strokePaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
const boundStroke = figma.variables.setBoundVariableForPaint(strokePaint, 'color', variable)
node.strokes = [boundStroke]
```

**Bind numeric variable (spacing, radius, font size, etc.):**
```js
node.setBoundVariable('paddingLeft', spacingVariable)
node.setBoundVariable('paddingRight', spacingVariable)
node.setBoundVariable('paddingTop', spacingVariable)
node.setBoundVariable('paddingBottom', spacingVariable)
node.setBoundVariable('itemSpacing', gapVariable)
node.setBoundVariable('topLeftRadius', radiusVariable)
node.setBoundVariable('topRightRadius', radiusVariable)
node.setBoundVariable('bottomLeftRadius', radiusVariable)
node.setBoundVariable('bottomRightRadius', radiusVariable)
```

**Bind typography variables to text node — use the Typography component (PREFERRED):**

Instead of manually binding all 5 typography variables one by one, use the **Typography** library component. It is a component set in `🅰️ EDS Spacing & Typography tokens` that contains a text node with all typography variables already bound (fontSize, fontFamily, fontWeight, lineHeight, letterSpacing). This is the canonical way to create token-bound text in EDS Figma components.

**Typography component key:** `53f25e8dfa82a49a239805fd0bb44566db2aee1d` (ComponentSet)

**Variant keys:**
| Variant | Component Key |
|---|---|
| `Mono numbers=False, Uppercase=False` | `99a64bc3db51b5e16350c7837ca4e0d80ae98c69` (default — use this for most text) |
| `Mono numbers=True, Uppercase=False` | `2a5f31bea5792084711283d4fb2e9b7b7d991081` (for tabular/numeric text) |
| `Mono numbers=False, Uppercase=True` | `163c0358b66314bd4b2209f4c4893272a0f96a49` (for uppercase labels) |
| `Mono numbers=True, Uppercase=True` | `dd6604ae628ebbe3ef4b0c1aad89386d1b0b2ee7` |

**Workflow: instantiate → detach → extract text node → discard wrapper**

```js
// Load fonts needed for mode resolution
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
await figma.loadFontAsync({ family: 'Equinor', style: 'Regular' })
await figma.loadFontAsync({ family: 'Equinor', style: 'Medium' })
await figma.loadFontAsync({ family: 'Equinor', style: 'Bold' })

// 1. Import the Typography variant component
const typoComp = await figma.importComponentByKeyAsync('99a64bc3db51b5e16350c7837ca4e0d80ae98c69')

// 2. Create an instance and temporarily append to page
const typoInstance = typoComp.createInstance()
figma.currentPage.appendChild(typoInstance)

// 3. Detach the instance (breaks it into a plain frame)
const detached = typoInstance.detachInstance()

// 4. Extract the text node from inside the detached frame
const textNode = detached.children.find(c => c.type === 'TEXT')

// 5. Configure the text node
textNode.characters = 'Your label text'
textNode.name = 'Label'
textNode.textAutoResize = 'WIDTH_AND_HEIGHT'

// 6. Bind text fill colour (the only thing NOT pre-bound by Typography)
const textColourVariable = await figma.variables.importVariableByKeyAsync('...')
const paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
const boundPaint = figma.variables.setBoundVariableForPaint(paint, 'color', textColourVariable)
textNode.fills = [boundPaint]

// 7. Move text node into your component (at desired child index)
yourComponent.insertChild(desiredIndex, textNode)

// 8. Clean up the empty wrapper frame
detached.remove()
```

The extracted text node comes with these variables **already bound**:
| Text property | Bound variable |
|---|---|
| `fontSize` | `Typography/Font size` |
| `fontFamily` | `Typography/Font family` |
| `fontWeight` | `Typography/Font weight` |
| `lineHeight` | `Typography/Line height` |
| `letterSpacing` | `Typography/Tracking` |

You only need to bind the **text fill colour** yourself (via `setBoundVariableForPaint`), since colour is not part of the Typography component.

Modes that control how these variables resolve are set on **parent frames**, not on the text node:
| Mode collection | Controls | Example values |
|---|---|---|
| `🅰️ Font and icon size` | Font size, line height, icon size | XS, SM, MD, LG, XL, 2XL–6XL |
| `🅰️ Font family` | Font family name | UI Body, Header |
| `🅰️ Font weight` | Font weight value | Lighter, Normal, Bolder |
| `🅰️ Line height` | Line height value | Default, Squished |
| `🅰️ Tracking` | Letter spacing | Tight, Normal, Wide, Loose |

**Set explicit variable mode on a frame:**
```js
// Get the collection from an imported variable
const collectionId = variable.variableCollectionId
// Set the mode (you need the modeId from the collection's modes array)
const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
const accentMode = collection.modes.find(m => m.name === 'Accent')
node.setExplicitVariableModeForCollection(collectionId, accentMode.modeId)
```

### Efficient Variable Importing

When you need multiple variables from the same collection, batch the lookup:

```js
const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
const edsColour = collections.find(c => c.name.includes('Colour') || c.name.includes('Color'))
const allVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(edsColour.key)

// Build a name-to-key map for quick lookup
const varMap = Object.fromEntries(allVars.map(v => [v.name, v.key]))

// Import multiple variables
const bgEmphasis = await figma.variables.importVariableByKeyAsync(varMap['Bg/Fill/Emphasis/Default'])
const textOnEmphasis = await figma.variables.importVariableByKeyAsync(varMap['Text/Strong on emphasis'])
const borderSubtle = await figma.variables.importVariableByKeyAsync(varMap['Border/Subtle'])
```

---

## Phase 5: Validate

1. Call `get_screenshot` on the created component to verify it visually
2. Check that:
   - Colours look correct for the chosen appearance mode
   - Spacing and proportions match the code implementation
   - Text uses the right font family and size
   - Auto layout direction and alignment are correct
3. Report what was created and flag any discrepancies

---

## EDS Token Reference

**IMPORTANT**: These are reference patterns derived from the token source files. Always verify against `get_variable_defs` output — variable names may have changed.

### Dynamic Colour Tokens (Appearance Collection)

These tokens change value based on the Appearance mode (Accent, Neutral, Info, Success, Warning, Danger).

**Background (Bg)**:

| Figma Variable | CSS Variable | States |
|---|---|---|
| `Bg/Fill/Emphasis/Default` | `--eds-color-bg-fill-emphasis-default` | Default, Hover, Active, Disabled |
| `Bg/Fill/Muted/Default` | `--eds-color-bg-fill-muted-default` | Default, Hover, Active, Disabled |
| `Bg/Canvas` | `--eds-color-bg-canvas` | — |
| `Bg/Surface` | `--eds-color-bg-surface` | — |

**Text** (also used for icons):

| Figma Variable | CSS Variable |
|---|---|
| `Text/Strong` | `--eds-color-text-strong` |
| `Text/Subtle` | `--eds-color-text-subtle` |
| `Text/Strong on emphasis` | `--eds-color-text-strong-on-emphasis` |
| `Text/Subtle on emphasis` | `--eds-color-text-subtle-on-emphasis` |
| `Text/Disabled` | `--eds-color-text-disabled` |

**Border**:

| Figma Variable | CSS Variable |
|---|---|
| `Border/Subtle` | `--eds-color-border-subtle` |
| `Border/Medium` | `--eds-color-border-medium` |
| `Border/Strong` | `--eds-color-border-strong` |
| `Border/Disabled` | `--eds-color-border-disabled` |

### Concept Colour Tokens (Cross-Cutting)

These do NOT change with appearance mode. They are consistent across all semantic intents.

| Figma Variable | CSS Variable | Purpose |
|---|---|---|
| `Bg/Floating` | `--eds-color-bg-floating` | Elevated surfaces (popovers, tooltips) |
| `Bg/Backdrop` | `--eds-color-bg-backdrop` | Modal backdrop overlay |
| `Bg/Input` | `--eds-color-bg-input` | Input field background |
| `Bg/Disabled` | `--eds-color-bg-disabled` | Disabled element background |
| `Border/Focus` | `--eds-color-border-focus` | Focus ring |
| `Border/Disabled` | `--eds-color-border-disabled` | Disabled border |
| `Text/Link` | `--eds-color-text-link` | Link text |
| `Text/Disabled` | `--eds-color-text-disabled` | Disabled text |

### Spacing Tokens (Semantic Collection)

Published variables used in Figma. Modes (Selectable Space, Density, etc.) control the resolved values.

**Selectable (interactive elements like buttons, chips, inputs)**:

| Figma Variable | CSS Variable | Scope |
|---|---|---|
| `Selectable/Space horizontal` | `--eds-selectable-space-horizontal` | Horizontal padding |
| `Selectable/Space vertical` | `--eds-selectable-space-vertical` | Vertical padding |
| `Selectable/Gap horizontal` | `--eds-selectable-gap-horizontal` | Horizontal gap between selectables |
| `Selectable/Gap vertical` | `--eds-selectable-gap-vertical` | Vertical gap between selectables |
| `Selectable/Icon + text gap ↔︎` | — | Horizontal gap between icon and text |
| `Selectable/Icon + text gap ↕︎` | — | Vertical gap between icon and text |
| `Selectable/Icon size` | — | Icon size within selectable |
| `Selectable/Icon container size` | — | Icon container size |
| `Selectable/Size` | — | Overall selectable target size |

**Container (card-like containers)**:

| Figma Variable | CSS Variable |
|---|---|
| `Container/Space horizontal` | `--eds-container-space-horizontal` |
| `Container/Space vertical` | `--eds-container-space-vertical` |
| `Container/Gap horizontal` | `--eds-container-gap-horizontal` |
| `Container/Gap vertical` | `--eds-container-gap-vertical` |

**Page (page-level layout)**:

| Figma Variable | CSS Variable |
|---|---|
| `Page/Space horizontal` | `--eds-page-space-horizontal` |
| `Page/Space vertical` | `--eds-page-space-vertical` |
| `Page/Gap horizontal` | `--eds-page-gap-horizontal` |
| `Page/Gap vertical` | `--eds-page-gap-vertical` |

**Generic (reusable spacing + border/stroke)**:

| Figma Variable | CSS Variable |
|---|---|
| `Generic/Space horizontal` | — |
| `Generic/Space vertical` | — |
| `Generic/Gap horizontal` | — |
| `Generic/Gap vertical` | — |
| `Generic/Corner radius` | — |
| `Generic/Stroke width` | — |

### Typography Tokens (Semantic Collection)

These variables resolve based on Font Family, Font Size, Line Height, Font Weight, and Tracking modes.

| Figma Variable | CSS Variable | Scope |
|---|---|---|
| `Typography/Font family` | `--eds-typography-font-family` | Font family name |
| `Typography/Font size` | `--eds-typography-font-size` | Font size in px |
| `Typography/Line height` | `--eds-typography-line-height` | Line height in px |
| `Typography/Font weight` | `--eds-typography-font-weight` | Font weight (numeric) |
| `Typography/Tracking` | `--eds-typography-tracking` | Letter spacing |
| `Typography/Baseline adjust top` | — | Top baseline adjustment |
| `Typography/Baseline adjust bottom` | — | Bottom baseline adjustment |

### Mode Reference

**Appearance modes** (dynamic colour collection):
`Neutral` (default), `Accent`, `Info`, `Success`, `Warning`, `Danger`

**Colour Scheme modes** (foundation collection):
`Light` (default), `Dark`

**Selectable Space modes**: `XS`, `SM`, `MD`, `LG`, `XL`

**Space Proportions modes**: `Squished`, `Squared`, `Stretched`

**Density modes**: `Comfortable` (default), `Spacious`

**Font Family modes**: `UI Body`, `Header`, `UI and Body`

**Font Size modes**: `XS`, `SM`, `MD`, `LG`, `XL`, `2XL`, `3XL`, `4XL`, `5XL`, `6XL`

**Font Weight modes**: `Lighter`, `Normal`, `Bolder`

**Line Height modes**: `Default`, `Squished`

**Font Baseline modes**: `Centred`, `Baselined`

**Tracking modes**: `Tight`, `Normal`, `Wide`, `Loose`

**Border Radius modes**: `None`, `Rounded`, `Pill`

**Stroke modes**: `None`, `Thin`, `Thick`

---

## Rules

- **Use dynamic colour tokens.** The skill creates components with the dynamic approach — variable names without semantic intent (e.g. `Bg/Fill/Emphasis/Default` not `Bg/Accent/Fill Emphasis/Default`). The semantic intent is applied via the Appearance MODE on the frame.
- **Never hardcode values.** Every fill, stroke, text colour, spacing, corner radius, stroke width, font size, font weight, line height, and letter spacing must be bound to an EDS variable.
- **Always verify variable names** against the `get_variable_defs` response. The mapping tables above are reference patterns — actual names may differ.
- **Set modes on frames, not layers.** All children inherit the mode. Apply appearance mode to the component frame, colour scheme to a wrapper section, and typography/spacing modes to the appropriate scope.
- **Use concept tokens for cross-cutting concerns.** `Bg/Floating`, `Border/Focus`, `Text/Link`, etc. do not change with appearance mode — use them for focus rings, disabled states, links, and elevated surfaces.
- **Name layers clearly** following EDS conventions: "Label", "Icon", "Leading icon", "Trailing icon", "Container".
- **Match the code structure.** If the component exists in code, match its JSX hierarchy in Figma. If it uses `data-color-appearance="accent"`, set the Accent appearance mode. If it uses `data-selectable-space="md"`, set the MD selectable space mode.

### Anti-patterns

- Using `generate_figma_design` to create tokenized components — it captures screenshots, not variable-bound layers. Use `use_figma` instead.
- Hardcoding hex colours or pixel values instead of binding variables.
- **Manually binding typography variables with `setBoundVariable`** instead of using the Typography component. The Typography component (`99a64bc3db51b5e16350c7837ca4e0d80ae98c69`) already has all 5 typography variables pre-bound. Instantiate it, detach, extract the text node, and discard the wrapper — this is simpler and less error-prone than binding each variable individually.
- **Hardcoding font family or weight** (e.g. `fontName = { family: 'Inter', style: 'Medium' }`) instead of using the Typography component's pre-bound text node.
- **Not loading all required font variants** before setting typography modes. When a mode change resolves to a different font (e.g. changing font family from UI Body to Header), Figma needs that font loaded. Always pre-load: Inter (Regular, Medium, Bold), Equinor (Regular, Medium, Bold, Italic, Medium Italic), and Noto Sans Symbols2 (Regular).
- Setting modes on individual text or shape nodes instead of their parent frame.
- Using static colour tokens (`Bg/Accent/Fill Muted/Default`) when the component code uses dynamic tokens (`data-color-appearance`).
- Forgetting to invoke the `figma-use` skill before each `use_figma` call.
- Creating all variants in a single `use_figma` call — chunk large components to stay under the 20KB response limit.
- Assuming variable names from the reference table without verifying via `get_variable_defs`.

---

## Example: Create an Accent Button

User: `/figma-create-component Button https://figma.com/design/abc123/my-file`

### Step-by-step agent workflow:

**1. Read component code**

Read `packages/eds-core-react/src/components/next/Button/Button.tsx`, `Button.types.ts`, and `button.css`.
- Discover: uses `data-color-appearance`, `data-selectable-space="md"`, `data-space-proportions="stretched"`, `data-font-size="md"`, `data-font-family="ui"`, `data-baseline="center"`
- CSS uses: `--eds-color-bg-fill-emphasis-default`, `--eds-color-text-strong-on-emphasis`, border-radius, selectable spacing

**2. Search for existing component**

Call `search_design_system("Button")` — check if one already exists in the library.

**3. Discover variables**

Call `get_variable_defs` on the target file to get variable references and collection keys.

**4. Create structure** (Chunk 1)

Invoke `figma-use` skill, then call `use_figma`:
- Create a Component node named "Button"
- Set auto layout: horizontal, counter-axis center-aligned, hug contents
- For the Label text: instantiate the Typography component (`99a64bc3db51b5e16350c7837ca4e0d80ae98c69`), detach the instance, extract the text node (which has all 5 typography variables pre-bound), set its characters to "Button", and append it to the Button component. Discard the empty wrapper frame.
- Return the node IDs

**5. Bind colour tokens** (Chunk 2)

Invoke `figma-use` skill, then call `use_figma`:
- Import `Bg/Fill/Emphasis/Default` → bind to Button frame fill
- Import `Text/Strong on emphasis` → bind to Label text fill (the only colour not included in the Typography component)
- Import `Border/Subtle` → bind to Button frame stroke (if outlined variant)

**6. Bind spacing** (Chunk 3)

Invoke `figma-use` skill, then call `use_figma`:
- Import `Selectable/Space horizontal` → bind to paddingLeft + paddingRight
- Import `Selectable/Space vertical` → bind to paddingTop + paddingBottom
- Import `Selectable/Icon + text gap ↔︎` → bind to itemSpacing
- Import `Generic/Corner radius` → bind to all corner radii
- Typography is already fully bound from the Typography component — no manual binding needed

**7. Set modes** (Chunk 4)

Invoke `figma-use` skill, then call `use_figma`:
- Set Appearance mode → **Accent** on the Button frame
- Set Selectable Space mode → **MD**
- Set Space Proportions mode → **Stretched**
- Set Font Size mode → **MD**
- Set Font Family mode → **UI and Body**
- Set Font Baseline mode → **Centred**
- Set Border Radius mode → **Rounded**
- Set Line Height mode → **Default**

**8. Validate**

Call `get_screenshot` on the created Button. Verify:
- Moss green emphasis background (Accent appearance)
- White text (strong on emphasis)
- Rounded corners
- Correct proportions (stretched = wider horizontal padding)
- UI font family at medium size

### Expected result

A Figma component named "Button" where every visual property is driven by EDS variables and responds correctly when modes are changed (e.g. switching appearance from Accent to Danger turns the button red).

---

## Test Prompt

Use this prompt to validate the skill end-to-end:

```
/figma-create-component Button <paste-your-figma-file-url-here>
```

After the component is created, manually verify in Figma:
1. Select the Button component
2. In the Variables panel, switch Appearance mode from Accent to Danger — the button should turn red
3. Switch to Neutral — the button should turn grey
4. Switch Colour Scheme to Dark — colours should adapt
5. Switch Selectable Space from MD to LG — padding should increase
6. Check that no hardcoded values remain (select any layer, check fills/strokes/spacing for variable badges)
