<!-- source: https://documentation-v2.tokens.studio/tokens/token-types.html -->

# Token Types [​](#token-types)

Studio supports the following token types, aligned with the W3C DTCG specification. Types are organized into core DTCG types and extended semantic types that Studio adds for common design system use cases.

## Core DTCG Types [​](#core-dtcg-types)

### Color [​](#color)

Represents a color value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `color` |
| **Value format** | Hex (`#3B82F6`), RGB (`rgb(59, 130, 246)`), HSL, OKLCH, or a reference |
| **Example** | `"$value": "#3B82F6"` |

Colors support alpha channels (e.g., `#3B82F680`) and CSS Color Level 4 functions (oklch, oklab, display-p3).

### Dimension [​](#dimension)

Represents a size or distance value with a unit.

| Property | Details |
| --- | --- |
| **DTCG Type** | `dimension` |
| **Value format** | Number with unit (`16px`, `1rem`, `0.5em`) |
| **Example** | `"$value": "16px"` |

Used for spacing, sizing, border-radius, and other measurements.

### Number [​](#number)

Represents a unitless numeric value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `number` |
| **Value format** | Number (integer or float) |
| **Example** | `"$value": 1.5` |

Used for line-height ratios, opacity values, font weights, and other unitless numbers.

### Text [​](#text)

Represents a text value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `text` |
| **Value format** | Any string |
| **Example** | `"$value": "Inter"` |

Commonly used for font family names and other text values.

Renamed from String

This type was previously called `string`. It has been renamed to `text` to align with the DTCG specification. Existing tokens using the `string` type are automatically normalized to `text`.

### Font Family [​](#font-family)

Represents a font family name or stack.

| Property | Details |
| --- | --- |
| **DTCG Type** | `fontFamily` |
| **Value format** | Font name string or comma-separated font stack |
| **Example** | `"$value": "Inter, sans-serif"` |

### Font Weight [​](#font-weight)

Represents a font weight value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `fontWeight` |
| **Value format** | Number (`400`, `700`) or keyword (`bold`, `normal`) |
| **Example** | `"$value": 700` |

### Duration [​](#duration)

Represents a time value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `duration` |
| **Value format** | Number with time unit (`200ms`, `0.3s`) |
| **Example** | `"$value": "200ms"` |

Used for animation durations and transition timing.

### Cubic Bezier [​](#cubic-bezier)

Represents an easing curve for animations and transitions.

| Property | Details |
| --- | --- |
| **DTCG Type** | `cubicBezier` |
| **Value format** | Array of 4 numbers `[x1, y1, x2, y2]` |
| **Example** | `"$value": [0.42, 0, 0.58, 1]` |

Equivalent to the CSS `cubic-bezier()` function.

### Boolean [​](#boolean)

Represents a true/false value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `boolean` |
| **Value format** | `true` or `false` |
| **Example** | `"$value": true` |

Boolean tokens display as a checkbox toggle in the token editor.

### Border [​](#border)

Represents a complete border value (composite type).

| Property | Details |
| --- | --- |
| **DTCG Type** | `border` |
| **Value format** | Object with `color`, `width`, and `style` |
| **Example** | See below |

json

```
{
  "$type": "border",
  "$value": {
    "color": "#36363620",
    "width": "1px",
    "style": "solid"
  }
}
```

### Shadow [​](#shadow)

Represents a box shadow value (composite type).

| Property | Details |
| --- | --- |
| **DTCG Type** | `shadow` |
| **Value format** | Object with `offsetX`, `offsetY`, `blur`, `spread`, and `color` |
| **Example** | See below |

json

```
{
  "$type": "shadow",
  "$value": {
    "offsetX": "0px",
    "offsetY": "4px",
    "blur": "6px",
    "spread": "-1px",
    "color": "#0000001a"
  }
}
```

### Typography [​](#typography)

Represents a composite typography value.

| Property | Details |
| --- | --- |
| **DTCG Type** | `typography` |
| **Value format** | Object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` |
| **Example** | See below |

json

```
{
  "$type": "typography",
  "$value": {
    "fontFamily": "Inter",
    "fontSize": "16px",
    "fontWeight": 400,
    "lineHeight": "1.5",
    "letterSpacing": "0px"
  }
}
```

Typography tokens can be composed from individual properties or defined as a composite value. In CSS export, they are expanded into individual properties.

## Extended / Semantic Types [​](#extended-semantic-types)

These types extend the core DTCG specification for common design system patterns. They provide semantic meaning to values that would otherwise be generic dimensions or numbers.

### Size [​](#size)

Represents a size value (width, height). Like `dimension`, but also accepts the `auto` keyword.

| Property | Details |
| --- | --- |
| **Type** | `size` |
| **Value format** | Dimension value (`48px`, `100%`) or `auto` |
| **Example** | `"$value": "48px"` |

### Space [​](#space)

Represents a spacing value. Like `dimension`, but can be negative (useful for negative margins).

| Property | Details |
| --- | --- |
| **Type** | `space` |
| **Value format** | Dimension value, can be negative (`-8px`, `16px`) |
| **Example** | `"$value": "16px"` |

### Font Size [​](#font-size)

Represents a font size value.

| Property | Details |
| --- | --- |
| **Type** | `fontSize` |
| **Value format** | Dimension value (`16px`, `1rem`) |
| **Example** | `"$value": "16px"` |

### Line Height [​](#line-height)

Represents a line height value.

| Property | Details |
| --- | --- |
| **Type** | `lineHeight` |
| **Value format** | Number (unitless ratio) or dimension (`1.5`, `24px`) |
| **Example** | `"$value": "1.5"` |

### Letter Spacing [​](#letter-spacing)

Represents a letter spacing value.

| Property | Details |
| --- | --- |
| **Type** | `letterSpacing` |
| **Value format** | Dimension value (`0.5px`, `0.02em`) |
| **Example** | `"$value": "0.02em"` |

### Border Radius [​](#border-radius)

Represents a border radius value.

| Property | Details |
| --- | --- |
| **Type** | `borderRadius` |
| **Value format** | Dimension value (`8px`, `0.5rem`) |
| **Example** | `"$value": "8px"` |

### Border Width [​](#border-width)

Represents a border width value.

| Property | Details |
| --- | --- |
| **Type** | `borderWidth` |
| **Value format** | Dimension value (`1px`, `2px`) |
| **Example** | `"$value": "1px"` |

### Text Case [​](#text-case)

Represents a text transformation value.

| Property | Details |
| --- | --- |
| **Type** | `textCase` |
| **Value format** | Keyword (`none`, `uppercase`, `lowercase`, `capitalize`) |
| **Example** | `"$value": "uppercase"` |

### Text Decoration [​](#text-decoration)

Represents a text decoration value.

| Property | Details |
| --- | --- |
| **Type** | `textDecoration` |
| **Value format** | Keyword (`none`, `underline`, `line-through`) |
| **Example** | `"$value": "underline"` |

### Asset [​](#asset)

Represents a reference to an external asset (image, icon, etc.).

| Property | Details |
| --- | --- |
| **Type** | `asset` |
| **Value format** | URL or path string |
| **Example** | `"$value": "https://example.com/icon.svg"` |

### Opacity [​](#opacity)

Represents an opacity value.

| Property | Details |
| --- | --- |
| **Type** | `opacity` |
| **Value format** | Number between 0 and 1 |
| **Example** | `"$value": 0.5` |

Maps to the DTCG `number` type but carries semantic meaning for transparency values.

## Using References Across Types [​](#using-references-across-types)

Any token value can reference another token of a compatible type:

json

```
{
  "button-radius": {
    "$type": "borderRadius",
    "$value": "{radius.medium}"
  }
}
```

Studio validates that references resolve to compatible types and warns you about mismatches.

## Next Steps [​](#next-steps)

-   [Creating tokens](./creating-tokens.html)
-   [Token sets](./token-sets.html)
-   [Theming with token variants](./../theming/theme-groups-and-options.html)