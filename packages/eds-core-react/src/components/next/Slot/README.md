# Slot

Utility component that enables the `asChild` pattern for polymorphic rendering. Exported publicly from `@equinor/eds-core-react/next`.

## What it does

`Slot` takes its props and merges them onto its single child element, instead of rendering a wrapper element. This lets consumers swap the underlying DOM element while keeping the component's styles and behavior.

## Merge behavior

| Prop type | Behavior |
|---|---|
| `className` | Concatenated (both parent and child classes kept) |
| `style` | Shallow merged (child overrides parent) |
| Event handlers | Composed (both called — child first, then parent) |
| Other props | Parent (Slot) wins if defined |

## How to use in a component

```tsx
import { Slot } from '../Slot'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ asChild, className, children, ...rest }, ref) {
    const classes = ['eds-button', className].filter(Boolean).join(' ')
    const sharedProps = { ref, className: classes, ...rest }

    if (asChild) {
      return <Slot {...sharedProps}>{children}</Slot>
    }

    return <button {...sharedProps}>{children}</button>
  },
)
```

Consumer usage:

```tsx
// Default — renders <button>
<Button>Click me</Button>

// asChild — renders <a> with Button styles
<Button asChild>
  <a href="/page">Click me</a>
</Button>

// asChild — renders router link with Button styles
<Button asChild>
  <RouterLink to="/page">Click me</RouterLink>
</Button>
```

## Known limitations

- Requires exactly one valid React element child when `asChild` is used
- Returns `null` silently if the child is invalid
- Does not support multiple children or text-only children
- **`disabled` on non-form elements**: The `disabled` HTML attribute and `:disabled` CSS pseudo-class only apply to form elements (`<button>`, `<input>`, etc.). When using `asChild` with e.g. `<a>`, `disabled` will be forwarded as an attribute but `:disabled` styles won't trigger. Data-attribute styles (like `data-color-appearance="neutral"`) still apply.
- **`ref` type mismatch**: Components are typed with a specific ref type (e.g. `forwardRef<HTMLButtonElement>`), but with `asChild` the ref actually points to the child element (e.g. `HTMLAnchorElement`). This is a known TypeScript limitation with the `asChild` pattern.
