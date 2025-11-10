# Migration Guide: TextField multiline to Textarea

This guide helps you migrate from the deprecated `TextField` component with `multiline` prop to using the `Textarea` component directly.

## Breaking Change

The `multiline` prop has been removed from `TextField` component. Users should now use the `Textarea` component directly for multiline text input.

## Why This Change?

- **Better type safety**: Removes complex union types that prevented proper onChange event typing
- **Clearer separation**: TextField for single-line input, Textarea for multiline input
- **Simpler implementation**: Reduces complexity and follows native HTML patterns more closely

## Migration Examples

### Basic Migration

**Before:**
```typescript
import { TextField } from '@equinor/eds-core-react'

<TextField 
  multiline 
  label="Description" 
  placeholder="Enter description"
/>
```

**After:**
```typescript
import { Textarea } from '@equinor/eds-core-react'

<Textarea 
  label="Description" 
  placeholder="Enter description"
/>
```

### With rowsMax

**Before:**
```typescript
<TextField 
  multiline 
  label="Comments"
  rows={3}
  rowsMax={10}
/>
```

**After:**
```typescript
<Textarea 
  label="Comments"
  rows={3}
  rowsMax={10}
/>
```

### With Variants

**Before:**
```typescript
<TextField 
  multiline 
  label="Feedback"
  variant="error"
  helperText="This field is required"
/>
```

**After:**
```typescript
<Textarea 
  label="Feedback"
  variant="error"
  helperText="This field is required"
/>
```

### With Event Handlers

**Before:**
```typescript
<TextField 
  multiline 
  label="Notes"
  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value)
  }}
/>
```

**After:**
```typescript
<Textarea 
  label="Notes"
  onChange={(event) => {
    // No manual type annotation needed!
    console.log(event.target.value)
  }}
/>
```

### With Refs

**Before:**
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null)

<TextField 
  multiline 
  textareaRef={textareaRef}
  label="Content"
/>
```

**After:**
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null)

<Textarea 
  ref={textareaRef}
  label="Content"
/>
```

## Component Comparison

| Feature | TextField (old multiline) | Textarea (new) |
|---------|---------------------------|----------------|
| Label | ✅ | ✅ |
| Helper Text | ✅ | ✅ |
| Meta Text | ✅ | ❌ (not needed for textarea) |
| Variants | ✅ | ✅ |
| Icons | ✅ | ❌ (not typical for textarea) |
| Units | ✅ | ❌ (not typical for textarea) |
| rowsMax | ✅ | ✅ |
| onChange typing | ❌ Required manual | ✅ Automatic |

## Automated Migration

### Using Find & Replace

For simple cases, you can use find and replace:

1. **Find:** `<TextField([^>]*)multiline([^>]*)>`
2. **Replace:** `<Textarea$1$2>`

Note: This is a basic pattern and may need manual adjustment for complex cases.

### Using Codemod

We provide a codemod to help automate this migration. See `CODEMOD.md` for details.

### Manual Review Required

The following cases need manual review:

1. **InputWrapper with custom styling** - You may need to wrap Textarea with InputWrapper
2. **Complex conditional rendering** - Check if multiline was used conditionally
3. **TypeScript types** - Update any type references from `TextFieldProps` to `TextareaProps`
4. **Ref handling** - Change `textareaRef` to `ref`
5. **Props like inputIcon, unit** - These are not available on Textarea and need alternative solutions

## Testing Your Migration

After migrating, ensure:

1. ✅ All multiline text inputs still render correctly
2. ✅ Form validation still works
3. ✅ Event handlers (onChange, onBlur, etc.) function as expected
4. ✅ Refs are properly connected
5. ✅ No TypeScript errors
6. ✅ Visual appearance matches expected design

## Need Help?

If you encounter issues during migration:

1. Review the examples in this guide
2. Create an issue on GitHub with details about your use case

## API Reference

### Textarea Component Props

The Textarea component accepts all standard HTML textarea attributes plus:

```typescript
type TextareaProps = {
  placeholder?: string
  variant?: 'error' | 'warning' | 'success'
  disabled?: boolean
  readOnly?: boolean
  rowsMax?: number
  label?: string
  helperText?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>
```

### What's Not Available

The following TextField-specific props are NOT available on Textarea:
- `inputIcon` - Icons are not typical for textareas
- `unit` - Units are not typical for textareas
- `meta` - Use helperText instead
