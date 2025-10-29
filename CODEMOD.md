# Codemod for TextField multiline to Textarea Migration

This codemod helps automate the migration from `TextField` with `multiline` prop to the `Textarea` component.

## Prerequisites

- Node.js 14 or higher
- jscodeshift installed globally or as a dev dependency

```bash
npm install -g jscodeshift
# or
pnpm add -D jscodeshift
```

## Usage

### Quick Start

```bash
# Run on a single file
npx jscodeshift -t textfield-to-textarea.codemod.js src/components/MyComponent.tsx

# Run on a directory
npx jscodeshift -t textfield-to-textarea.codemod.js src/

# With TypeScript parser
npx jscodeshift -t textfield-to-textarea.codemod.js --parser=tsx src/
```

### Options

```bash
# Dry run (see what would change without modifying files)
npx jscodeshift -t textfield-to-textarea.codemod.js --dry src/

# Show diff
npx jscodeshift -t textfield-to-textarea.codemod.js --print src/

# Verbose output
npx jscodeshift -t textfield-to-textarea.codemod.js -v 2 src/
```

## What the Codemod Does

1. **Finds TextField components** with `multiline` prop set to `true`
2. **Replaces component name** from `TextField` to `Textarea`
3. **Removes multiline prop**
4. **Renames textareaRef to ref** (if present)
5. **Updates imports** to include `Textarea` instead of (or in addition to) `TextField`
6. **Removes TextField import** if no longer used in the file

## Examples

### Example 1: Basic Transformation

**Before:**
```tsx
import { TextField } from '@equinor/eds-core-react'

function MyComponent() {
  return (
    <TextField 
      multiline 
      label="Description"
      placeholder="Enter text"
    />
  )
}
```

**After:**
```tsx
import { Textarea } from '@equinor/eds-core-react'

function MyComponent() {
  return (
    <Textarea 
      label="Description"
      placeholder="Enter text"
    />
  )
}
```

### Example 2: With Refs

**Before:**
```tsx
import { TextField } from '@equinor/eds-core-react'
import { useRef } from 'react'

function MyComponent() {
  const ref = useRef<HTMLTextAreaElement>(null)
  
  return (
    <TextField 
      multiline 
      textareaRef={ref}
      label="Notes"
    />
  )
}
```

**After:**
```tsx
import { Textarea } from '@equinor/eds-core-react'
import { useRef } from 'react'

function MyComponent() {
  const ref = useRef<HTMLTextAreaElement>(null)
  
  return (
    <Textarea 
      ref={ref}
      label="Notes"
    />
  )
}
```

### Example 3: Mixed Usage (TextField kept for single-line)

**Before:**
```tsx
import { TextField } from '@equinor/eds-core-react'

function MyComponent() {
  return (
    <>
      <TextField label="Name" />
      <TextField multiline label="Description" />
    </>
  )
}
```

**After:**
```tsx
import { TextField, Textarea } from '@equinor/eds-core-react'

function MyComponent() {
  return (
    <>
      <TextField label="Name" />
      <Textarea label="Description" />
    </>
  )
}
```

## Limitations

The codemod handles most common cases but has limitations:

### Not Handled Automatically

1. **Conditional multiline prop:**
   ```tsx
   <TextField multiline={someCondition} />
   ```
   → Manual review needed

2. **Dynamic prop spreading:**
   ```tsx
   const props = { multiline: true, label: "Text" }
   <TextField {...props} />
   ```
   → Manual review needed

3. **Props not available on Textarea:**
   ```tsx
   <TextField multiline inputIcon={<Icon />} />
   ```
   → Manual refactoring needed (remove inputIcon)

4. **Complex ref patterns:**
   ```tsx
   <TextField multiline ref={combineRefs(ref1, ref2)} />
   ```
   → Manual review needed

## Manual Review Checklist

After running the codemod, review the following:

- [ ] Check for TextField components with conditional `multiline` props
- [ ] Verify all Textarea components have correct props
- [ ] Remove any Textarea-incompatible props (inputIcon, unit, meta)
- [ ] Update TypeScript types if using TextFieldProps
- [ ] Test all migrated components
- [ ] Update tests if they reference TextField with multiline
- [ ] Check console for any warnings

## Prompts for Common Scenarios

### Find all TextField with multiline in your codebase

```bash
# Using grep
grep -r "TextField.*multiline" src/

# Using ripgrep (faster)
rg "TextField.*multiline" src/

# Using ag (the silver searcher)
ag "TextField.*multiline" src/
```

### Find potential missed cases

```bash
# Find TextField with multiline spread in props
rg "TextField.*\{\.\.\..*\}" src/

# Find conditional multiline
rg "multiline=\{" src/
```

## Testing the Codemod

Test the codemod on sample files before running on your entire codebase:

```bash
# Create a test file
cat > test-file.tsx << 'EOF'
import { TextField } from '@equinor/eds-core-react'

export const TestComponent = () => (
  <TextField multiline label="Test" />
)
EOF

# Run codemod
npx jscodeshift -t textfield-to-textarea.codemod.js --dry test-file.tsx

# Check the output
cat test-file.tsx
```

## Rollback

If you need to rollback the changes:

```bash
# If you have git
git checkout -- src/

# If you made a backup
cp -r src.backup/* src/
```

## Support

If you encounter issues with the codemod:

1. Check the limitations section above
2. Review the manual review checklist
3. Try running with `-v 2` for verbose output
4. Create an issue with a minimal reproduction case

## Advanced Usage

### Custom Parser Options

```bash
# For JavaScript files
npx jscodeshift -t textfield-to-textarea.codemod.js --parser=babylon src/

# For Flow
npx jscodeshift -t textfield-to-textarea.codemod.js --parser=flow src/
```

### Ignore Patterns

```bash
# Ignore specific directories
npx jscodeshift -t textfield-to-textarea.codemod.js \
  --ignore-pattern="**/node_modules/**" \
  --ignore-pattern="**/build/**" \
  src/
```

### Process Specific File Types

```bash
# Only .tsx files
find src -name "*.tsx" -exec npx jscodeshift -t textfield-to-textarea.codemod.js {} \;

# Both .tsx and .ts files
npx jscodeshift -t textfield-to-textarea.codemod.js \
  --extensions=tsx,ts \
  src/
```
