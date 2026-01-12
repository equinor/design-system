---
applyTo: '**'
---

# Figma MCP Component Implementation

This guide covers the workflow for implementing components from Figma using MCP (Model Context Protocol), with emphasis on correct token extraction and Code Connect sub-component patterns.

## Workflow

When implementing a component from Figma using MCP:

### 1. Get Design Context First

```
figma_get_design_context → Understand structure and Code Connect mappings
```

### 2. Get Screenshot for Visual Reference

```
figma_get_screenshot → Capture visual appearance for verification
```

### 3. ⚠️ CRITICAL: Extract Variables for EACH State

```
figma_get_variable_defs → Get exact tokens for the selected element
```

**You MUST call `figma_get_variable_defs` for EVERY component state:**

- Default state
- Hover state
- Active/Pressed state
- Focus state
- **Disabled state** ← Most commonly missed!
- Error state
- etc.

### 4. Document Extracted Tokens

Before writing any CSS, document the tokens from Figma:

```css
/* ==========================================================================
   Disabled state
   Source: Figma figma_get_variable_defs on State=Disabled
   ========================================================================== */

/* Extracted tokens:
   - Text color: var(--eds-color-border-medium) = #aeaeae
   - Background: var(--eds-color-bg-surface) = #ffffff
   - Border: var(--eds-color-border-subtle) = #d4d4d4
*/
```

### 5. Implement Using Exact Tokens

```css
/* ✅ CORRECT: Use exact token from Figma */
.accordion--disabled .accordion__header-title {
  color: var(--eds-color-border-medium);
}

/* ❌ WRONG: Semantic assumption without verification */
.accordion--disabled .accordion__header-title {
  color: var(--eds-color-text-subtle); /* NOT in Figma spec! */
}
```

---

## Code Connect: Sub-Component Convention

### Identifying Sub-Components in Figma

When analyzing a Figma component, look for these naming prefixes:

| Prefix | Meaning                       | Code Connect Pattern      |
| ------ | ----------------------------- | ------------------------- |
| `⌘`    | Internal/nested sub-component | Use `figma.nestedProps()` |
| `.`    | Internal/nested sub-component | Use `figma.nestedProps()` |
| `↳`    | Nested variant indicator      | Use `figma.nestedProps()` |

**Examples from Figma layer names:**

- `⌘ Accordion` → Sub-component of Accordion
- `.⌘ Accordion` → Internal nested component
- `⌘ Button` → Sub-component of Button
- `↳ ⌘ Button` → Deeply nested Button sub-component

### Implementation Pattern

When you see a component with `⌘` or `.` prefix in Figma, implement it as a nested component using `figma.nestedProps()`:

```tsx
// Figma structure:
// └── Accordion [EDS]        ← Main component (public)
//     └── ⌘ Accordion        ← Sub-component (internal)
//         └── Container
//             └── Header

figma.connect(Accordion, 'https://www.figma.com/design/.../node-id=2096-766', {
  props: {
    // Main component props (from component set variants)
    disabled: figma.enum('State', {
      Disabled: true,
    }),

    // ⚠️ Sub-component props accessed via nestedProps
    // The name MUST match the Figma layer name (without the ".")
    accordion: figma.nestedProps('⌘ Accordion', {
      open: figma.enum('Open', {
        true: true,
        false: false,
      }),
    }),
  },
  example: ({ disabled, accordion }) => (
    <Accordion disabled={disabled} defaultOpen={accordion.open}>
      <Accordion.Header>Accordion Header</Accordion.Header>
      <Accordion.Content>Content</Accordion.Content>
    </Accordion>
  ),
})
```

### Nested Sub-Component Pattern

For deeply nested components (indicated by `↳`):

```tsx
// Figma structure:
// └── Button [EDS]           ← Main component
//     └── ↳ ⌘ Button         ← Deeply nested sub-component

figma.connect(Button, 'https://www.figma.com/design/.../node-id=18-1373', {
  props: {
    // Access deeply nested component
    baseButton: figma.nestedProps('↳ ⌘ Button', {
      variant: figma.enum('Variant', {
        Primary: 'contained',
        Secondary: 'outlined',
        Ghost: 'ghost',
      }),
    }),
  },
  example: ({ baseButton }) => <Button variant={baseButton.variant} />,
})
```

### Sub-Component Checklist

When implementing Code Connect:

- [ ] Identify all layers starting with `⌘`, `.`, or `↳`
- [ ] Each sub-component gets its own `figma.nestedProps()` call
- [ ] Layer name in `nestedProps()` must match Figma EXACTLY (including symbols)
- [ ] Sub-component props are accessed via the nestedProps variable (e.g., `accordion.open`)
- [ ] Document the Figma structure in the file header comment

### Documenting Component Structure

Always add a header comment documenting the Figma hierarchy:

```tsx
/**
 * Code Connect for Accordion component.
 *
 * Figma structure:
 * └── Accordion [EDS] (node-id: 2096:766) - Public component
 *     ├── State variants: Default, Hover, Disabled
 *     └── ⌘ Accordion - Internal nested sub-component
 *         └── Open variants: true, false
 *
 * Sub-components:
 * - ⌘ Accordion: Controls open/closed state
 */
```

---

## Anti-patterns

### Token Extraction

- ❌ **Assuming token names based on semantics** (e.g., "disabled should use text-subtle")
- ❌ **Only checking the default state** and guessing other states
- ❌ **Using `figma_get_design_context` alone** without `figma_get_variable_defs`
- ❌ **Hardcoding hex values** instead of using CSS variables
- ❌ **Copying from similar components** without verifying Figma spec

### Code Connect

- ❌ **Ignoring `⌘` or `.` prefixed layers** - these are sub-components!
- ❌ **Flattening sub-component props** into main component props
- ❌ **Incorrect layer names** in `nestedProps()` - must match exactly
- ❌ **Missing documentation** of Figma component hierarchy

---

## Required MCP Calls Per Component

| Tool                         | When to Use                            | Required?             |
| ---------------------------- | -------------------------------------- | --------------------- |
| `figma_get_design_context`   | Understand structure, get Code Connect | ✅ Always             |
| `figma_get_screenshot`       | Visual verification                    | ✅ Always             |
| `figma_get_variable_defs`    | Extract exact tokens                   | ✅ **For EACH state** |
| `figma_get_metadata`         | Page/node structure overview           | Optional              |
| `figma_get_code_connect_map` | Find existing implementations          | Optional              |

---

## Complete Checklist

### Before Implementation

- [ ] Selected correct component variant in Figma
- [ ] Called `figma_get_design_context` to understand structure
- [ ] Called `figma_get_screenshot` for visual reference
- [ ] Identified all sub-components (`⌘`, `.`, `↳` prefixes)

### Token Extraction (for EACH state)

- [ ] Called `figma_get_variable_defs` for **default** state
- [ ] Called `figma_get_variable_defs` for **hover** state
- [ ] Called `figma_get_variable_defs` for **disabled** state
- [ ] Called `figma_get_variable_defs` for **focus** state
- [ ] Called `figma_get_variable_defs` for **error** state (if applicable)
- [ ] Documented all extracted tokens in CSS comments

### Code Connect

- [ ] Main component connected to public Figma node
- [ ] All `⌘`/`.` sub-components use `figma.nestedProps()`
- [ ] Layer names match Figma exactly
- [ ] Header comment documents Figma hierarchy
- [ ] Example function demonstrates correct usage

### Verification

- [ ] Used EXACT variable names from Figma (no substitutions)
- [ ] Verified implementation against screenshot
- [ ] Tested all component states in Storybook
