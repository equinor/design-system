# Component conventions for EDS 2.0

- **Status:** Proposed
- **Date:** 2026-02-27
- **Decision makers:** EDS Core Team

## Context

EDS 2.0 introduces a new generation of components in `/next` (`packages/eds-core-react/src/components/next/`). We need to establish clear conventions for how these components are built so that the codebase stays consistent as the component library grows.

Styling is already covered in [ADR-0002](./0002-use-vanilla-css-with-design-tokens-for-eds-2.md). This ADR covers the remaining conventions: color system usage, data attributes vs props, component composition patterns, and distribution strategy.

## Decision Drivers

- Components should be easy to use correctly and hard to use incorrectly
- Theming (color scheme, density) must work globally without per-component configuration
- API should align with Figma component properties where possible
- Consumers should not need to understand internal implementation details (like data attributes)
- Patterns must scale across 50+ components without becoming inconsistent

## Decisions

### 1. Use the dynamic color system

#### Options Considered

**Static color tokens** — Each component explicitly references per-variant tokens (e.g., `--eds-color-accent-bg-fill-emphasis-default`).

**Pros:**

- Explicit, easy to trace which token is used where
- Consumers can override specific tokens per component

**Cons:**

- Verbose — every component needs full token paths for each color variant
- Harder to maintain consistency across components
- Does not leverage the `data-color-appearance` attribute system

**Dynamic color tokens** — Components reference generic color roles (e.g., `--eds-color-bg-fill-emphasis-default`) and the actual values resolve based on the `data-color-appearance` attribute.

**Pros:**

- Concise — components reference generic roles, appearance is controlled via attributes
- Supports global theming via `data-color-scheme` and `data-color-appearance`
- Consistent color usage across all components
- Aligns with the token architecture in `@equinor/eds-tokens`

**Cons:**

- Less explicit — need to understand the token resolution chain
- Slightly harder for consumers to override specific colors

#### Decision

Use the **dynamic color system**. Components reference generic color role tokens and rely on `data-color-appearance` attributes for variant-specific colors. This leverages the full token architecture and enables global theming.

```css
/* Dynamic - component uses generic roles */
.eds-button {
  background: var(--eds-color-bg-fill-emphasis-default);
  color: var(--eds-color-text-on-emphasis);
}
```

### 2. Data attributes internally, props for consumers

#### Options Considered

**Expose data attributes directly** — Consumers set `data-*` attributes on components themselves.

**Pros:**

- Simple implementation, no prop-to-attribute mapping needed
- Full control for consumers

**Cons:**

- Leaks implementation details
- Error-prone — consumers need to know exact attribute names and values
- No type safety or autocomplete

**Props that map to data attributes** — Components accept typed props and set the corresponding data attributes internally.

**Pros:**

- Clean, typed API with autocomplete
- Implementation details hidden from consumers
- Validation and defaults handled by the component

**Cons:**

- Slightly more code in the component

#### Decision

Components use **data attributes internally** for CSS styling but expose **typed props** to consumers. The component maps props to the correct data attributes.

```tsx
// Consumer uses props
<Button color="accent" size="sm">Save</Button>

// Component maps to data attributes internally
<button className="eds-button" data-color-appearance="accent" data-selectable-space="sm">
  Save
</button>
```

**Exception: global attributes.** Some data attributes are set once at the application root and inherited by all components. These are not exposed as props:

- `data-color-scheme` — Light/dark mode
- `data-space-density` — Spacious/comfortable

```tsx
// Set once at root level by the consumer
<div data-color-scheme="dark" data-space-density="comfortable">
  <App />
</div>
```

### 3. Flat props by default, compound components only for dynamic content

#### Options Considered

**Always use compound components** — All components expose sub-components (e.g., `Card.Header`, `Card.Content`, `Card.Actions`).

**Pros:**

- Flexible — consumers can compose freely
- Clear visual hierarchy in JSX

**Cons:**

- More API surface area to learn and maintain
- Easy to use incorrectly (wrong nesting, missing required parts)
- Harder to enforce accessibility (labels, descriptions must be manually connected)

**Always use flat props** — All configuration is done via props on a single component.

**Pros:**

- Simple API, hard to misuse
- Component handles internal structure and accessibility

**Cons:**

- Doesn't work when children are dynamic or user-defined
- Can lead to prop explosion for complex components

**Flat by default, compound when needed** — Use flat props for components with predictable structure, compound pattern for containers with user-defined content.

**Pros:**

- Best of both worlds — simple API where possible, flexible where needed
- Matches how consumers naturally think about components

**Cons:**

- Requires judgement on which pattern to use (mitigated by the guideline below)

#### Decision

Use **flat props by default**. Use compound components only when the component is a **container for user-defined, variable content**.

**Guideline:** If the component has a **predictable structure** (same parts every time, just different values), use flat props. If the component is a **container** where consumers decide the number, order, or type of children, use compound components.

```tsx
// Flat props — predictable structure
<TextField label="Name" helperMessage="Required" />
<Checkbox label="Accept terms" />

// Compound — container for variable content
<Accordion>
  <Accordion.Item label="Section 1">
    <p>Any content here</p>
  </Accordion.Item>
  <Accordion.Item label="Section 2">
    <CustomComponent />
  </Accordion.Item>
</Accordion>
```

Components with flat props may use compound building blocks internally (e.g., TextField composes Field, Field.Label, and Input internally), but these are not exposed to consumers unless needed for advanced use cases.

### 4. Distribution via `/next` entry point during beta

The distribution and migration strategy is documented in the [EDS 2.0 Storybook documentation](../../packages/eds-core-react/stories/docs/EDS2.mdx). In summary:

- During beta: components are imported from `@equinor/eds-core-react/next`
- CSS must be imported separately: `@equinor/eds-core-react/next/index.css`
- At v3.0.0: components move to `@equinor/eds-core-react` (import path change only)

## Consequences

- Good, because the dynamic color system enables global theming with minimal per-component configuration
- Good, because typed props hide implementation details and provide autocomplete and validation
- Good, because flat props make most components simple to use and hard to misuse
- Good, because compound components are available for complex containers that need flexibility
- Good, because global attributes (color scheme, density) are set once and inherited
- Bad, because developers need to learn which pattern (flat vs compound) applies to each component
- Bad, because the prop-to-data-attribute mapping adds a small amount of code per component
- Bad, because consumers familiar with the old compound-heavy API need to adjust to the new flat style

### Confirmation

- Code reviews verify that new components follow these conventions
- Flat props are the default; compound pattern requires justification in the PR
- Design token usage follows the dynamic color system

## Related

- [ADR-0002: Use vanilla CSS with design tokens for EDS 2.0](./0002-use-vanilla-css-with-design-tokens-for-eds-2.md)
- [GitHub issue #4245](https://github.com/equinor/design-system/issues/4245)
- [Token System Guide](../../documentation/how-to/TOKEN_SYSTEM_GUIDE.md)
- [EDS 2.0 About page](../../packages/eds-core-react/stories/docs/EDS2.mdx)
