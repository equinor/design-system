<!-- source: https://documentation-v2.tokens.studio/tokenscript/supported-functions.html -->

# Supported Functions [​](#supported-functions)

TokenScript includes a library of built-in functions and methods you can use in expressions and generator schemas. These cover math, string manipulation, type introspection, color operations, accessibility checks, and more.

Built-in functions are provided by the engine and are always available. Schema-defined functions (like the color functions) are loaded from the **Schema Registry** at runtime.

## Math Functions [​](#math-functions)

Built-in math functions are always available in expressions. All math functions are **unit-aware** — if you pass a value with a unit (e.g. `16px`), the unit is preserved in the result.

### Arithmetic [​](#arithmetic)

| Function | Description | Parameters |
| --- | --- | --- |
| `pow` | Power function | `base`, `exp` |
| `sqrt` | Square root | `n` |
| `cbrt` | Cube root | `n` |
| `abs` | Absolute value | `n` |
| `sign` | Sign of number (-1, 0, or 1) | `n` |
| `hypot` | Hypotenuse (√(a² + b² + …)) | `a`, `b`, … |
| `pi` | Returns the value of π | — |

### Rounding [​](#rounding)

| Function | Description | Parameters |
| --- | --- | --- |
| `round` | Round to nearest integer | `n` |
| `round_to` | Round to specified decimal places | `n`, `precision` |
| `floor` | Round down | `n` |
| `ceil` | Round up | `n` |
| `trunc` | Truncate toward zero | `n` |

### Logarithmic & Exponential [​](#logarithmic-exponential)

| Function | Description | Parameters |
| --- | --- | --- |
| `log` | Logarithm (natural if no base, or with specified base) | `n`, `base` (optional) |
| `ln` | Natural logarithm | `n` |
| `log10` | Base-10 logarithm | `n` |
| `log2` | Base-2 logarithm | `n` |
| `log1p` | log(1 + n), more accurate for small values | `n` |
| `exp` | e^n | `n` |
| `expm1` | e^n − 1, more accurate for small values | `n` |

### Trigonometric [​](#trigonometric)

| Function | Description | Parameters |
| --- | --- | --- |
| `sin` | Sine (radians) | `n` |
| `cos` | Cosine (radians) | `n` |
| `tan` | Tangent (radians) | `n` |
| `asin` | Arcsine | `n` |
| `acos` | Arccosine | `n` |
| `atan` | Arctangent | `n` |
| `atan2` | Two-argument arctangent | `y`, `x` |
| `sinh` | Hyperbolic sine | `n` |
| `cosh` | Hyperbolic cosine | `n` |
| `tanh` | Hyperbolic tangent | `n` |
| `asinh` | Inverse hyperbolic sine | `n` |
| `acosh` | Inverse hyperbolic cosine | `n` |
| `atanh` | Inverse hyperbolic tangent | `n` |

### Aggregation & Clamping [​](#aggregation-clamping)

| Function | Description | Parameters |
| --- | --- | --- |
| `min` | Minimum value (unit-aware) | `a`, `b`, … |
| `max` | Maximum value (unit-aware) | `a`, `b`, … |
| `sum` | Sum of values (unit-aware) | `a`, `b`, … |
| `average` | Arithmetic mean (unit-aware) | `a`, `b`, … |
| `clamp` | CSS-style clamp | `min`, `preferred`, `max` |

### Modulo & Remainder [​](#modulo-remainder)

Breaking Change

The `%` (modulo) operator has been **removed**. Use the `mod()` or `remainder()` functions instead.

| Function | Description | Parameters |
| --- | --- | --- |
| `mod` | Euclidean modulo — the result is always **non-negative** | `a`, `b` |
| `remainder` | Standard remainder — the result can be negative | `a`, `b` |

```
mod(7, 3)       → 1
mod(-7, 3)      → 2       // always ≥ 0
remainder(-7, 3) → -1     // preserves sign of dividend
```

### Snapping & Typography [​](#snapping-typography)

| Function | Description | Parameters |
| --- | --- | --- |
| `snap` | Snaps a value to the nearest multiple of an increment. Equivalent to `round(value / increment) * increment`. Useful for pixel-aligned design scales. | `value`, `increment` |
| `base_font_size` | Computes a base font size (mm) according to DIN 1450:2024-11 legibility standard. Derives font size from viewing distance and required visual angle. | `distance`, `visualAngle`, `xHeightRatio` (default 0.476), `visusFactor` (default 1.0), `viewingAngleDeg` (default 0) |

```
snap(47.68, 8)     → 48      // nearest multiple of 8
snap(13, 4)        → 12      // nearest multiple of 4

// DIN 1450: signage text at 1m viewing distance (9 arcmin)
base_font_size(1000, 9)  → font size in mm
// Lesetext at 400mm (13 arcmin) with off-axis correction
base_font_size(400, 13, 0.476, 1.0, 15)
```

DIN 1450 Visual Angle Reference

Per DIN 1450 Tabelle 2: use `9` arcminutes for Signalisationstext (signage), `10` for Konsultationstext (reference), `13` for Lesetext (continuous reading). The `distance` parameter is in millimetres.

## String Methods [​](#string-methods)

Strings in TokenScript have built-in methods that you call using dot notation. All method names use **snake\_case**.

Breaking Change

String functions are no longer available as global functions (e.g. `uppercase(str)`). Use methods instead: `str.upper()`. The `length()` global now only works on lists — for string length, use `.length()`.

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `.upper()` | Converts to uppercase | — | `string` |
| `.lower()` | Converts to lowercase | — | `string` |
| `.length()` | Returns character count (Unicode-aware) | — | `number` |
| `.trim()` | Removes leading and trailing whitespace | — | `string` |
| `.concat(other)` | Concatenates with another string | `other`: string | `string` |
| `.split(delimiter?)` | Splits into a list of strings | `delimiter`: string (optional) | `list` |
| `.contains(substr)` | Checks if string contains a substring | `substr`: string | `boolean` |
| `.starts_with(prefix)` | Checks if string starts with prefix | `prefix`: string | `boolean` |
| `.ends_with(suffix)` | Checks if string ends with suffix | `suffix`: string | `boolean` |
| `.replace(old, new)` | Replaces all occurrences | `old`: string, `new`: string | `string` |
| `.substring(start, end)` | Extracts a substring by index | `start`: number, `end`: number | `string` |
| `.char_at(index)` | Returns the character at an index | `index`: number | `string` |
| `.index_of(substr)` | Returns the index of a substring (-1 if not found) | `substr`: string | `number` |

```
"Hello World".upper()            → "HELLO WORLD"
"Hello World".lower()            → "hello world"
"Hello World".length()           → 11
"  hello  ".trim()               → "hello"
"Hello".concat(" World")         → "Hello World"
"a,b,c".split(",")              → ["a", "b", "c"]
"Hello".contains("ell")          → true
"Hello".starts_with("He")        → true
"Hello".ends_with("lo")          → true
"Hello World".replace("World", "TokenScript") → "Hello TokenScript"
"Hello".substring(1, 4)          → "ell"
"Hello".char_at(0)               → "H"
"Hello World".index_of("World")  → 6
```

Unicode-Aware

The `.length()` method counts **Unicode code points**, not bytes. For example, `"café".length()` returns `4`, and `"日本語".length()` returns `3`.

## Type Functions [​](#type-functions)

Functions for inspecting and converting types at runtime.

| Function | Description | Parameters |
| --- | --- | --- |
| `type` | Returns the type name as a string. For values with units (e.g. `16px`), returns the **unit string** (e.g. `"px"`) | `value` |
| `parse_int` | Parses a string to an integer | `string`, `base` (optional) |
| `is_number` | Checks if value is a number | `value` |
| `is_string` | Checks if value is a string | `value` |
| `is_boolean` | Checks if value is a boolean | `value` |
| `is_list` | Checks if value is a list | `value` |
| `is_map` | Checks if value is a map | `value` |
| `is_null` | Checks if value is null | `value` |
| `to_number` | Converts to a number | `value` |
| `to_string` | Converts to a string | `value` |

```
type(42)         → "Number"
type(16px)       → "px"
type("hello")    → "String"
type(true)       → "Boolean"
is_number(42)    → true
is_string(42)    → false
```

INFO

The `type()` function returns the **unit string** for values with units. This lets you branch on unit type in expressions: `type(val) == "px"`.

## Collection Functions [​](#collection-functions)

| Function | Description | Parameters |
| --- | --- | --- |
| `length` | Returns the length of a list. For string length, use the `.length()` method instead. | `list` |

## Color Functions [​](#color-functions)

The registry ships with an extensive set of color functions organized by purpose. Each function operates in perceptually uniform color spaces (OKLCH, OKLab) unless otherwise noted.

### Mixing & Blending [​](#mixing-blending)

| Function | Description | Parameters |
| --- | --- | --- |
| `mix` | Blends two colors in OKLCH space | `color1`, `color2`, `amount` (0–1, default 0.5) |
| `alpha_blend` | Porter-Duff "over" compositing (fg × α + bg × (1-α)) | `foreground`, `background`, `alpha` (0–1, default 0.5) |

**Color-space variants** — these perform the same mix operation in a specific color space:

| Function | Color Space |
| --- | --- |
| `ts_mix_srgb` | sRGB (linear) |
| `ts_mix_hsl` | HSL |
| `ts_mix_lch` | LCH |
| `ts_mix_p3` | Display P3 |

### Lightness & Darkness [​](#lightness-darkness)

| Function | Description | Parameters |
| --- | --- | --- |
| `lighten` | Increases lightness in OKLab space | `color`, `amount` (0–1, default 0.25) |
| `darken` | Decreases lightness in OKLab space | `color`, `amount` (0–1, default 0.25) |
| `adjust_lightness` | Shifts lightness by a relative amount | `color`, `amount` |
| `set_lightness` | Sets lightness to an absolute value | `color`, `lightness` |
| `clamp_lightness` | Clamps lightness to a min/max range | `color`, `min`, `max` |
| `scale_lightness` | Scales lightness proportionally | `color`, `factor` |
| `lightness` | Returns the OKLCH lightness of a color | `color` |

**Color-space variants for lighten:**

| Function | Color Space |
| --- | --- |
| `ts_lighten_srgb` | sRGB |
| `ts_lighten_hsl` | HSL |
| `ts_lighten_lch` | LCH |
| `ts_lighten_p3` | Display P3 |

**Color-space variants for darken:**

| Function | Color Space |
| --- | --- |
| `ts_darken_srgb` | sRGB |
| `ts_darken_hsl` | HSL |
| `ts_darken_lch` | LCH |
| `ts_darken_p3` | Display P3 |

### Hue & Saturation [​](#hue-saturation)

| Function | Description | Parameters |
| --- | --- | --- |
| `saturate` | Increases chroma (saturation) | `color`, `amount` |
| `desaturate` | Decreases chroma (saturation) | `color`, `amount` |
| `rotate_hue` | Rotates hue by degrees | `color`, `degrees` |
| `adjust_hue` | Shifts hue by a relative amount | `color`, `amount` |
| `set_hue` | Sets hue to an absolute value | `color`, `hue` |
| `adjust_chroma` | Shifts chroma by a relative amount | `color`, `amount` |
| `set_chroma` | Sets chroma to an absolute value | `color`, `chroma` |
| `scale_chroma` | Scales chroma proportionally | `color`, `factor` |
| `clamp_chroma` | Clamps chroma to a min/max range | `color`, `min`, `max` |
| `hue` | Returns the hue of a color | `color` |
| `chroma` | Returns the chroma of a color | `color` |
| `complement` | Returns the complementary color (180° hue rotation) | `color` |

### Alpha & Opacity [​](#alpha-opacity)

**Color-space variants for alpha adjustment:**

| Function | Color Space |
| --- | --- |
| `ts_alpha_srgb` | sRGB |
| `ts_alpha_hsl` | HSL |
| `ts_alpha_lch` | LCH |
| `ts_alpha_p3` | Display P3 |

### Color Harmony [​](#color-harmony)

| Function | Description | Parameters |
| --- | --- | --- |
| `harmonize` | Shifts hue toward a source color (Material Design 3 inspired) | `color`, `source`, `amount` (0–1, default 0.5) |
| `warmer` | Shifts color toward warm tones | `color`, `amount` |
| `cooler` | Shifts color toward cool tones | `color`, `amount` |
| `neutral_variant` | Creates a neutral variant of a color | `color`, `amount` |

### Color Effects [​](#color-effects)

| Function | Description | Parameters |
| --- | --- | --- |
| `grayscale` | Converts a color to grayscale | `color` |
| `invert` | Inverts a color | `color` |
| `sepia` | Applies a sepia tone | `color`, `amount` |
| `muted` | Creates a muted version | `color`, `amount` |
| `vibrant` | Creates a more vibrant version | `color`, `amount` |

### Accessibility & Contrast [​](#accessibility-contrast)

These functions help you build accessible color systems that meet WCAG and APCA standards.

| Function | Description | Parameters |
| --- | --- | --- |
| `contrast_ratio` | WCAG 2.1 contrast ratio (1–21) | `color1`, `color2` |
| `apca_contrast` | APCA contrast (WCAG 3.0 draft). Returns Lc value (-108 to +106). |Lc| ≥ 60 recommended for body text | `text`, `background` |
| `wcag_level` | Returns WCAG compliance level: `AAA`, `AA`, `AA-large`, or `fail` | `foreground`, `background` |
| `meets_contrast` | Checks if two colors meet a target contrast ratio | `color1`, `color2`, `target` |
| `best_contrast` | Picks the highest-contrast color from a list of candidates | `background`, `candidates` |
| `contrast_color` | Computes WCAG 2.1 contrast ratios and returns black or white for optimal readability against a background. (Renamed from `auto_text_color`, which is still available but deprecated.) | `background` |
| `adjust_to_contrast` | Adjusts a foreground color's lightness to hit a target contrast ratio while preserving hue and chroma | `foreground`, `background`, `target` (default 4.5) |
| `relative_luminance` | Returns WCAG relative luminance (0–1) | `color` |
| `luminance` | Returns the luminance of a color | `color` |

### Color Difference (Delta E) [​](#color-difference-delta-e)

These functions measure perceptual distance between colors — useful for quality control and consistency checks.

| Function | Description | Parameters |
| --- | --- | --- |
| `delta_e_2000` | CIEDE2000 — the CIE-recommended perceptual difference formula | `color1`, `color2`, `kL`, `kC`, `kH` (weights, default 1) |
| `delta_e_ok` | OKLab-based color difference | `color1`, `color2` |
| `delta_e_76` | Classic CIE76 Euclidean distance in Lab space | `color1`, `color2` |
| `are_similar` | Checks if two colors are perceptually similar (within a threshold) | `color1`, `color2`, `threshold` |
| `hue_difference` | Returns the angular hue difference between two colors | `color1`, `color2` |

### Color Analysis [​](#color-analysis)

| Function | Description | Parameters |
| --- | --- | --- |
| `is_light` | Returns `true` if color is perceptually light (OKLCH lightness > threshold) | `color`, `threshold` (default 0.6) |
| `is_dark` | Returns `true` if color is perceptually dark | `color`, `threshold` |
| `is_warm` | Returns `true` if the color has a warm hue | `color` |
| `is_cool` | Returns `true` if the color has a cool hue | `color` |
| `is_neutral` | Returns `true` if the color has low chroma | `color` |

### Gamut Management [​](#gamut-management)

Functions for handling colors that may fall outside a display's reproducible range.

| Function | Description | Parameters |
| --- | --- | --- |
| `in_gamut` | Checks if a color is within sRGB gamut | `color`, `epsilon` (tolerance, default 0.000075) |
| `to_gamut` | Maps a color into sRGB gamut | `color` |
| `clamp_to_gamut` | Clamps a color to sRGB gamut boundaries | `color` |

## Control Flow [​](#control-flow)

### Ternary Operator [​](#ternary-operator)

TokenScript supports the ternary operator for conditional expressions:

```
condition ? valueIfTrue : valueIfFalse
```

The condition **must** evaluate to a strict boolean (`true` or `false`). Values like `0`, `1`, `""`, or `null` are not automatically coerced to booleans and will produce an error.

```
5 > 3 ? "yes" : "no"              → "yes"
true ? 1 : 2                       → 1
{color.mode} == "dark" ? 0.9 : 0.1 → depends on mode
```

Ternary expressions can be nested for more complex logic:

```
true ? (false ? 1 : 2) : 3         → 2
```

Strict Boolean Required

The condition must be a boolean expression. Using a number or string as the condition (e.g. `0 ? "a" : "b"`) will fail. Use comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<=`) to produce a boolean.

## Using Functions in Expressions [​](#using-functions-in-expressions)

Built-in functions and schema functions can be used directly in token value expressions and generator schemas. Call them by keyword with parenthesized arguments:

```
lighten({color.primary}, 0.2)
round_to(pow({spacing.base}, 2), 1)
clamp(12px, {font.size.body}, 24px)
```

In generator schema output expressions:

yaml

```
outputs:
  color.primary.light:
    value: "lighten(inputs.baseColor, 0.2)"
    type: color
```

### Function Structure [​](#function-structure)

Every function in the registry follows this structure:

| Field | Description |
| --- | --- |
| `name` | Human-readable name |
| `keyword` | The identifier used in expressions |
| `description` | What the function does |
| `input` | Parameter definitions with types and defaults |
| `requirements` | Color space dependencies |
| `returns` | Output type and description |
| `multiOutput` | Whether the function returns multiple values |

### Parameter Types [​](#parameter-types)

Functions accept these parameter types:

| Type | Description | Example |
| --- | --- | --- |
| `color` | A color value (hex, RGB, HSL, OKLCH, etc.) | `#667eea` |
| `number` | A numeric value | `0.5` |
| `list` | An array of values | `["#000", "#fff"]` |

## Next Steps [​](#next-steps)

-   [Creating Generators](./creating-generators.html) — Build generators that use these functions
-   [Schemas & Dependencies](./schemas-and-dependencies.html) — Understand how schemas reference functions
-   [What are Magic Generators?](./what-is-tokenscript.html) — Overview of the system