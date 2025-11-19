# Multi-Color Palette Interpolation Implementation

## Overview

Extend the color palette generator to support interpolation between multiple color values at user-defined anchor points. Each color can have 2+ anchor colors (with associated step positions), and the palette will interpolate lightness and hue while maintaining Gaussian chroma adjustment.

## Core Changes

### 1. Type System Updates

**File:** `apps/eds-color-palette-generator/src/types.ts`

Update `ColorDefinition` to support anchor points:

```typescript
export type ColorAnchor = {
  value: string // color value (any format)
  step: number // which step (1-15) this anchors to
}

export type ColorDefinition = {
  name: string
  // Support both legacy single value and new anchor array
  value?: string // legacy single color
  anchors?: ColorAnchor[] // new multi-color with steps
}
```

### 2. Configuration File Updates

**Files:**

- `apps/eds-color-palette-generator/src/config/palette.ts`
- `packages/eds-tokens/palette-config.json`

Update one example color to demonstrate the new anchor format:

```typescript
{
  name: 'Moss Green',
  anchors: [
    { value: 'oklch(0.4973 0.084851 204.553)', step: 15 },
    { value: 'oklch(0.65 0.09 200)', step: 1 }
  ]
}
```

Keep other colors with single `value` for backwards compatibility.

### 3. Core Interpolation Logic

**File:** `apps/eds-color-palette-generator/src/utils/color.ts`

Create new function `generateColorScaleWithInterpolation`:

```typescript
export function generateColorScaleWithInterpolation(
  anchors: ColorAnchor[],
  lightnessValues: number[],
  mean: number,
  stdDev: number,
  format: ColorFormat = 'OKLCH',
): string[] {
  // 1. Sort anchors by step
  // 2. For each palette step:
  //    - Find surrounding anchors
  //    - Create Color.js range between them (OKLCH space, shorter hue)
  //    - Interpolate to get base color for this step
  //    - Extract interpolated L and H values
  //    - Apply gaussian chroma from the interpolated base
  //    - Override L with lightnessValues[i] (from config)
  //    - Format and return
}
```

Key interpolation approach using color.js:

- Use `Color.range(color1, color2, { space: 'oklch', hue: 'shorter' })`
- Interpolate L and H between anchors
- For C (chroma): use gaussian function applied to the interpolated color's base chroma

Update `generateColorScale` to detect anchors and delegate:

```typescript
export function generateColorScale(
  baseColorOrAnchors: string | ColorAnchor[],
  // ... existing params
) {
  if (Array.isArray(baseColorOrAnchors)) {
    return generateColorScaleWithInterpolation(...)
  }
  // existing single-color logic
}
```

### 4. UI Updates - ColorScale Component

**File:** `apps/eds-color-palette-generator/src/components/ColorScale.tsx`

Add controls next to the color input (after the color picker, before delete):

1. **Display existing anchors** (if more than one):
   - Show list of anchors with step numbers
   - Each anchor has: step input, color input, remove button

2. **Add anchor button** (+):
   - Opens dialog/inline form to add new anchor
   - User selects step (1-15, dropdown)
   - User inputs color value
   - Validates step isn't already taken

3. **Remove anchor button** (for each anchor):
   - Removes that specific anchor
   - Minimum 1 anchor required

4. **Migration logic**:
   - If `color.value` exists (legacy), display single color input
   - If `color.anchors` exists, display anchor list UI
   - Button to "Add second color" converts from legacy to anchors format

Props updates:

```typescript
type ColorScaleProps = {
  // ... existing
  baseColor?: string // legacy
  anchors?: ColorAnchor[] // new
  onChangeAnchors?: (anchors: ColorAnchor[]) => void
}
```

### 5. Parent Component Updates

**File:** `apps/eds-color-palette-generator/src/app/page.tsx`

Update state and handlers:

- Normalize colors on load (convert `value` to single-anchor format internally)
- Update `updateColorValue` to handle anchors
- Add `updateColorAnchors(index, anchors)` handler
- Pass anchor data to `generateColorScale` calls

### 6. Configuration Utils

**File:** `apps/eds-color-palette-generator/src/utils/configurationUtils.ts`

Update export/import to handle both formats:

- Serialize anchors in downloads
- Parse anchors on upload
- Maintain backwards compatibility with single-value configs

## Backwards Compatibility

- Single `value` colors continue to work unchanged
- localStorage handles both formats
- Configuration files support both schemas
- UI auto-detects format and renders appropriate controls

## Testing Strategy

1. Add unit tests for `generateColorScaleWithInterpolation`
2. Test anchor sorting and boundary conditions
3. Verify Gaussian chroma still applies correctly
4. Test UI with 2, 3+ anchors (if logic is dynamic)
5. Test legacy single-color backwards compatibility

## Implementation Notes

- Keep dynamic architecture for 3+ colors even though UI starts with 2
- Use color.js range API: `new Color(anchor1).range(anchor2, { space: 'oklch', hue: 'shorter' })`
- Sort anchors by step to handle any insertion order
- Validate anchor steps are within 1-15 range
- Handle edge cases (all anchors at same step, missing step 1 or 15)

---

## Grading Rubric for Implementation

### Functionality (40 points)

- [ ] **Multi-anchor interpolation works** (15 pts)
  - Colors interpolate smoothly between anchors
  - Hue transitions use "shorter" path
  - Lightness interpolates correctly
- [ ] **Gaussian chroma still applies** (10 pts)
  - Chroma follows gaussian curve based on lightness
  - Visual vibrancy matches single-color approach
- [ ] **Anchor management UI** (10 pts)
  - Can add second color with step selection
  - Can remove anchors (min 1)
  - Step validation works
- [ ] **Backwards compatibility** (5 pts)
  - Single-value colors still work
  - Legacy configs load correctly

### Code Quality (25 points)

- [ ] **Type safety** (8 pts)
  - ColorDefinition handles both formats
  - Proper TypeScript throughout
  - No `any` types
- [ ] **Code organization** (8 pts)
  - Clean separation of concerns
  - Reusable functions
  - Well-named variables
- [ ] **Error handling** (5 pts)
  - Invalid anchors handled gracefully
  - Color parsing errors caught
- [ ] **Documentation** (4 pts)
  - Functions have JSDoc comments
  - Complex logic explained

### User Experience (20 points)

- [ ] **Intuitive UI** (8 pts)
  - Clear how to add second color
  - Visual feedback on anchors
  - Step numbers clearly labeled
- [ ] **Performance** (7 pts)
  - No lag when updating anchors
  - Memoization works correctly
- [ ] **Visual polish** (5 pts)
  - UI matches existing design
  - Smooth transitions
  - Proper spacing

### Testing (10 points)

- [ ] **Unit tests** (6 pts)
  - Interpolation logic tested
  - Edge cases covered
- [ ] **Integration testing** (4 pts)
  - UI interaction tested
  - Config import/export tested

### Maintainability (5 points)

- [ ] **Future extensibility** (3 pts)
  - Logic supports 3+ anchors
  - No hardcoded limits
- [ ] **Code comments** (2 pts)
  - Complex sections explained
  - TODOs for future work

**Total: 100 points**

**Grading Scale:**

- 90-100: Excellent - Production ready
- 80-89: Good - Minor improvements needed
- 70-79: Acceptable - Some issues to address
- Below 70: Needs significant work
