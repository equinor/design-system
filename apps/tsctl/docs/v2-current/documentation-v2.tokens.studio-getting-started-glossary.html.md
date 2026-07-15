<!-- source: https://documentation-v2.tokens.studio/getting-started/glossary.html -->

# Glossary [​](#glossary)

A reference of key terms used throughout Tokens Studio and its documentation.

## Tokens & Structure [​](#tokens-structure)

### Token [​](#token)

A named design value — the atomic unit of a design system. A token has a **name** (path), a **value**, and an optional **type**.

json

```
{
  "color.primary.base": {
    "$value": "#FF0000",
    "$type": "color",
    "$description": "Brand primary color"
  }
}
```

Tokens use dot-notation paths for hierarchy: `color.primary.base` means the "base" token inside the "primary" group inside the "color" namespace.

### Token Type [​](#token-type)

The classification of a token's value. Determines how the value is parsed, validated, and exported.

**Primitive types** (single values): `color`, `dimension`, `number`, `fontFamily`, `fontWeight`, `duration`, `opacity`, `string`, `boolean`.

**Composite types** (structured objects): `shadow`, `typography`, `border`, `cubicBezier`, `gradient`.

**Semantic types** (aliases that carry intent): `space` (margins/padding), `size` (width/height), `fontSize` (text sizing). These resolve to `dimension` but communicate their intended use.

### Token Set [​](#token-set)

A named file or logical group of related tokens. Token sets are the building blocks that get combined into themes.

Examples: `foundation` (shared base values), `brand/alpha` (brand-specific overrides), `semantic/dark` (dark mode tokens).

The name format `group/mode` is significant — `brand/alpha` means group "brand", mode "alpha".

### Token Group [​](#token-group)

A namespace within a token file. Groups use dot-separated paths: all tokens under `color.primary.*` belong to the "color.primary" group. Groups are hierarchical — `color` contains `color.primary` which contains `color.primary.base`.

### Token Collection [​](#token-collection)

In the Figma context, a collection maps to a **theme group**. Each collection has modes (variants) and contains variables. For example, a "brand" collection with modes "alpha", "beta", "gamma".

### DTCG Format [​](#dtcg-format)

**Design Tokens Community Group** — the W3C community standard format for token files. Uses `$`\-prefixed keys: `$value` (the token's value), `$type` (the token type), `$description` (human-readable description), and `$extensions` (custom metadata).

Tokens Studio reads and writes DTCG-formatted JSON.

## References & Expressions [​](#references-expressions)

### Reference (Token Reference) [​](#reference-token-reference)

An expression that points to another token's value using curly-brace syntax: `{color.primary.base}`. When resolved, the reference is replaced with the target token's value.

References create dependencies between tokens — if token A references token B, then B must be resolved before A.

### Alias [​](#alias)

A token whose value is purely a reference — nothing else. `{color.primary.base}` is an alias. `{color.primary.base} * 0.5` is NOT an alias (it's an expression containing a reference).

In Figma export, aliases become native Figma variable aliases. Expressions become concrete values.

### Expression [​](#expression)

A string containing TokenScript code that computes a value. Expressions can contain references (`{spacing.base}`), arithmetic (`{spacing.base} * 2 + 4`), functions (`lighten({color.primary}, 0.2)`), units (`16 * 2 px`), and method chains (`{color.primary}.to.oklch()`).

Expressions are the "formulas" of the token system — they let tokens derive from other tokens dynamically.

## Theming & Dimensions [​](#theming-dimensions)

### Theme [​](#theme)

A named combination of dimension selections that activates specific token sets.

### Theme Group [​](#theme-group)

A grouping of related themes that correspond to a single dimension. For example, a "brand" theme group containing themes "alpha", "beta", "gamma". In Figma export, each theme group becomes a **collection**.

### Dimension [​](#dimension)

A categorical axis of variation in your design system. Each dimension has multiple possible values called **contexts**.

Common dimensions: **brand** (`alpha`, `beta`, `gamma`), **colorMode** (`light`, `dark`), **breakpoint** (`mobile`, `tablet`, `desktop`).

Dimensions are what make tokens multi-dimensional — the same token can have different values depending on which brand, color mode, and breakpoint are selected.

### Context [​](#context)

One specific value within a dimension. "dark" is a context of the "colorMode" dimension. "alpha" is a context of the "brand" dimension.

### Set (in resolver config) [​](#set-in-resolver-config)

An unconditional token source — it's always included regardless of dimension selection. Typically your foundation/base tokens.

### Modifier [​](#modifier)

A dimension-specific token source that maps each context to different token files. Modifiers are what make tokens vary by dimension. For example, a "brand" modifier maps `alpha` to `brand/alpha.json` and `beta` to `brand/beta.json`.

### Resolution Order [​](#resolution-order)

The sequence in which sets and modifiers are merged. Later entries override earlier ones using **last-write-wins** — like CSS specificity, more specific layers override more general ones.

### Permutation [​](#permutation)

One specific combination of contexts across all dimensions. With 3 brands × 2 color modes × 3 breakpoints = 18 permutations. Each permutation produces a complete set of resolved tokens.

## TokenScript Language [​](#tokenscript-language)

### TokenScript [​](#tokenscript)

The domain-specific language used for token value expressions, generator implementations, and function definitions. TokenScript evaluates pure expressions in a sandboxed environment — it has no I/O, no filesystem access, and no network access.

### Lexer [​](#lexer)

The first stage of expression processing. Breaks a raw string into lexical tokens — the smallest meaningful units.

For example, `{spacing.base} * 2 px` becomes: `REFERENCE("spacing.base")`, `MULTIPLY`, `NUMBER(2)`, `FORMAT("px")`.

### Parser [​](#parser)

The second stage. Takes lexical tokens and builds an AST (abstract syntax tree) following operator precedence rules — multiplication binds tighter than addition, just like standard math.

### Unit [​](#unit)

A label attached to a numeric value: `px`, `rem`, `em`, `%`, `vw`, `vh`, `pt`, `cm`, `mm`, `in`, `deg`, `rad`, `turn`, `ms`, `s`.

Units in TokenScript are tags, not physical dimensions. `3px * 3px = 9px` (not `9px²`). This matches CSS `calc()` behavior.

## Functions & Generators [​](#functions-generators)

### Built-in Function [​](#built-in-function)

A function provided by the TokenScript engine. Built-ins include math functions (`pow`, `sqrt`, `min`, `max`, `round`, `floor`, `ceil`), string functions (`uppercase`, `lowercase`, `trim`), type functions (`type`, `toNumber`, `toString`), and color constructors (`hex`, `rgb`, `oklch`, `hsl`).

### Schema-Defined Function [​](#schema-defined-function)

A function whose implementation is written in TokenScript and loaded from the schema registry at runtime. Examples: `lighten()`, `darken()`, `mix()`, `contrast_ratio()`.

The distinction from built-ins matters — schema-defined functions can be extended without recompiling the engine.

### Generator [​](#generator)

A special function that produces multiple colors from one input. Used for creating palettes and harmonies. Examples: `shade_scale` (9-step dark palette), `tint_scale` (9-step light palette), `triadic` (3 harmonious colors), `analogous` (neighboring hue colors).

## Color System [​](#color-system)

### Color Space [​](#color-space)

A mathematical model for representing colors. Each space has different channels and trade-offs.

| Space | Channels | Use |
| --- | --- | --- |
| sRGB | R, G, B | Web standard, hex colors |
| OKLCH | L, C, H | Perceptually uniform — adjustments look natural |
| OKLab | L, a, b | Perceptual, good for interpolation |
| HSL | H, S, L | Intuitive but perceptually uneven |
| P3 | R, G, B | Wide gamut for modern displays |

### Method Chaining [​](#method-chaining)

The `.to` accessor on colors enables conversion between color spaces:

```
{color.primary}.to.oklch()         // convert to OKLCH
{color.primary}.to.oklch().to.p3() // chain conversions
{color.primary}.alpha              // get alpha channel
{color.primary}.alpha(0.5)         // set alpha
```

## Export & Output [​](#export-output)

### Deduplication [​](#deduplication)

The process of analyzing all permutations to classify each token as **base** (identical everywhere), **dimension-specific** (varies by one dimension), or **cross-dimension** (varies by a combination). This prevents redundant output.

### Layer Assignment [​](#layer-assignment)

The result of deduplication — tokens organized into layers. A base layer for shared tokens, dimension-specific layers (e.g., `[data-color-mode="dark"]` in CSS), and cross-dimension layers for tokens that vary by multiple axes.

### Transpilation [​](#transpilation)

Converting a TokenScript expression into platform-native syntax. For example, the CSS exporter transpiles `{spacing.base} * 2` into `calc(var(--spacing-base) * 2)`.

### Transform [​](#transform)

A function that converts a resolved token value to a platform-specific format. For example, a color becomes a CSS hex string (`#FF0000`) or a Figma RGBA object (`{r: 1, g: 0, b: 0, a: 1}`).

## Schema System [​](#schema-system)

### Schema [​](#schema)

A machine-readable type specification that teaches TokenScript how to understand, create, and transform a particular kind of value. Schemas define a type's properties, constraints, initializers, conversions, and validation rules.

### Schema Registry [​](#schema-registry)

The centralized collection of 175+ schemas covering token types, color spaces, functions, generators, and output formats. Adding a new color space or function doesn't require changing engine code — you add a schema and the engine picks it up.

### Schema-Driven [​](#schema-driven)

The architecture principle where all domain-specific knowledge lives in schemas rather than hardcoded engine code. The engine is a generic evaluator; schemas tell it what types exist and how they work.