# Use `asChild` + `Slot` for polymorphic rendering in EDS 2.0

- **Status:** Approved
- **Date:** 2026-04-01
- **Decision makers:** EDS Core Team

## Context

Some EDS 2.0 components render interactive elements (`<a>`, `<button>`) that consumers may need to swap for framework-specific alternatives — for example, rendering a Next.js `<Link>` or React Router `<Link>` instead of a plain `<a>` tag. This is commonly known as _polymorphic rendering_.

While building the Link component (#4601), we discovered the need for this pattern. Button will also need it (#4746), and more components are likely to follow — so we need a consistent approach across the library.

**Note:** The `as` prop on Input (`'input' | 'textarea'`) is a _different_ use case — it selects between two native elements within the same component. That pattern is not affected by this decision.

## Decision Drivers

- TypeScript types must be correct and maintainable without complex generics
- Prop collisions between parent and child must be predictable and well-defined
- The pattern must work with any consumer component (router links, custom wrappers, etc.)
- API should be simple to understand and hard to misuse
- Must align with the rest of the EDS 2.0 conventions (vanilla CSS, `forwardRef`, named exports)

## Options Considered

### Option 1: `as` prop (styled-components / Chakra pattern)

The component accepts an `as` prop that specifies which element or component to render:

```tsx
<Link as={RouterLink} to="/about">About</Link>
```

**Pros:**

- Familiar to developers coming from styled-components or Chakra UI
- Concise API for simple cases

**Cons:**

- Complex TypeScript generics needed to infer the correct props for the rendered element — fragile and hard to maintain
- Prop collisions: parent and child props share a flat namespace, making it unclear which component receives which prop
- The `as` component's own props are mixed into the parent's prop type, leading to confusing autocomplete

### Option 2: `asChild` + `Slot` (Radix pattern)

The component accepts an `asChild` boolean. When true, it renders a `Slot` that merges the component's props onto the single child element:

```tsx
<Link asChild>
  <RouterLink to="/about">About</RouterLink>
</Link>
```

**Pros:**

- Clean TypeScript — no generics needed; the child component keeps its own types
- No prop collisions — parent and child props are explicitly separated in JSX
- Works with any component, including those with incompatible prop types
- Well-established pattern (Radix UI) with broad community adoption
- Composable — can be nested and combined with other patterns

**Cons:**

- Slightly more verbose than `as` (two elements instead of one)
- Requires a `Slot` utility to merge props correctly
- Developers unfamiliar with Radix may need to learn the pattern

### Option 3: Render props / wrapper pattern

The component exposes a render prop or expects consumers to wrap it:

```tsx
<Link renderAs={(props) => <RouterLink {...props} to="/about" />}>
  About
</Link>
```

**Pros:**

- Full control for consumers
- No magic — explicit prop passing

**Cons:**

- Worst DX of the three — verbose and harder to read
- Inconsistent with how the rest of the React ecosystem handles polymorphism
- Callback-heavy API conflicts with EDS 2.0's goal of simple, flat props

## Decision

Use **`asChild` + `Slot`** for polymorphic rendering in EDS 2.0.

This pattern satisfies the key decision drivers: TypeScript types stay simple and correct, prop handling is predictable (merge behavior is documented in the Slot utility), and it works with any consumer component without complex generics.

The `Slot` utility lives in `packages/eds-core-react/src/components/next/Slot/` and handles prop merging with these rules:

- `className` — concatenated
- `style` — shallow-merged (child wins on conflicts)
- Event handlers — composed (child runs first, then parent)
- Other props — parent wins (component's semantic props take precedence)

### Which components should support `asChild`

**Should support:** Components that render a single interactive element consumers commonly need to swap — **Link**, **Button**, and similar navigation/action elements.

**Should not support:** Form inputs (use `as` for element variants like input/textarea), icons, layout primitives, and components where swapping the root element does not make sense.

### Consequences

- Good, because TypeScript types are simple — no generics, no type parameter forwarding
- Good, because the pattern is well-established (Radix UI) and documented
- Good, because consumers can use any router or custom component without EDS needing to know about it
- Good, because prop merge behavior is explicit and predictable
- Bad, because the `asChild` API is slightly more verbose than `as` (two JSX elements)
- Bad, because developers unfamiliar with Radix need to learn the pattern (mitigated by documentation)

### Confirmation

- Code reviews verify that new interactive components support `asChild` where appropriate
- The `Slot` utility is shared — components must not implement their own prop merging
- Components that add `asChild` must include tests for prop merging (className, events, ref forwarding)

## Related

- [ADR-0004: Component conventions for EDS 2.0](./0004-component-conventions-for-eds-2.md)
- [GitHub issue #4747](https://github.com/equinor/design-system/issues/4747) — ADR tracking issue
- [GitHub issue #4746](https://github.com/equinor/design-system/issues/4746) — Button `asChild` implementation
- [GitHub PR #4601](https://github.com/equinor/design-system/pull/4601) — Link component (first `asChild` implementation)
