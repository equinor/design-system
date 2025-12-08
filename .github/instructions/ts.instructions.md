---
applyTo: '**/*.ts,**/*.tsx'
---

# TypeScript Guidelines

## Type Definitions

- **Interfaces over types** for object structures
- **Union types** for constrained options (e.g., `'primary' | 'secondary'` instead of `string`)
- **Explicit typing** where clarity matters; inference for obvious cases
- **Immutable data** (const, readonly properties)
- **Avoid `any`** unless impossible; use `unknown` if needed
- **Extend definitions** rather than duplicating

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary'
  disabled?: boolean
}

const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {}

// ❌ Avoid
type ButtonVariant = string
const handleClick = (event: any) => {}
```

## Functional Programming

- Pure functions where possible
- Avoid state mutations
- Optional chaining `?.` and nullish coalescing `??`
- Prefer `const` over `let`

## Testing

**Testing Library priorities:**

1. Query by role: `getByRole('button', { name: /submit/i })`
2. Query by accessible name: `getByText('Submit')`
3. Query by label: `getByLabelText('Username')`
4. Last resort: `getByTestId('submit-btn')`

**Test structure:**

```typescript
test('Button displays loading state when disabled', () => {
  render(<Button disabled>Loading</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});
```

**Formatting rules:**

- No blank lines between render and assertions
- Group related assertions together
- One blank line between test cases
- Descriptive test names explaining behavior

**Coverage:**

- User interactions (clicks, keyboard, focus)
- Accessibility (ARIA, keyboard navigation)
- Edge cases and error states
- Props variations

**Anti-patterns:**

```typescript
// ❌ Implementation testing
test('state updates', () => {
  // testing internal state, not user behavior
})

// ✅ Behavior testing
test('Button shows success message when form is submitted', () => {
  // testing what user sees
})
```
