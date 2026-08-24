# Name Figma component properties by one internally consistent convention

- **Status:** Accepted
- **Date:** 2026-08-19
- **Decision makers:** Edvard Pires Bjørgen, EDS Core Team

## Context

Component properties in the EDS Core Components Figma library are named inconsistently: the same concept appears under different names across components, and a property's name often does not survive translation into a code identifier.

An audit of all 51 components and 210 properties (August 2026) measured it:

- **The appearance axis had five names** — `Variant`, `Variants`, `Style`, `Type` and `Emphasis`. Button carried two of them at once.
- **`Type` meant something different on all seven components that used it**, which makes it useless to a consumer.
- **Six spellings of two boolean values** — `false|true`, `true|false`, `True|False`, `False|true`, `On|Off`, `Off|On`. One property mixed casing internally.
- **17 properties were declared but referenced by no layer.** They appeared in the properties panel and to every tool, and did nothing.
- **Two live properties on Button collapsed to the same identifier**, distinguished only by a decorator glyph that consumers strip.
- **The six input components each named the same nine concepts differently.** The typed value was `Text area` — including on Search, Select and ComboBox — and one boolean was `Title + Description` on three components and `Label + Description` on the other three.

31% of properties failed at least one mechanical rule.

This matters now because the library is increasingly read by machines, not only people: Code Connect, the Figma MCP server (`get_design_context`, `get_variable_defs`), codegen and AI tooling all translate Figma properties into code. Inconsistent names force every consumer to guess, and the mapping has to be re-invented per component.

Two facts frame the decision:

**Figma and code will never map 1:1.** Figma needs properties code has no equivalent for — pseudo-state axes, authoring presets, slot-visibility toggles — and code has props Figma does not express. A mapping layer between them is permanent, not a gap to be closed.

**Neither side simply follows the other.** Design and implementation each move first at different times; code frequently lags behind design, and Figma routinely carries capability that has no prop yet.

## Decision Drivers

- Consumers should be able to write the Figma → code mapping once and have it stay stable, rather than re-deriving it per component
- A property name must survive translation into a legal code identifier
- Designers read these names in the Figma properties panel, so they must stay readable there
- The convention must be machine-checkable — an unenforced glossary is what produced the drift in the first place
- Figma imposes hard limits that any convention has to accept (see _Constraints imposed by Figma_)
- Parity with code is not achievable and must not be assumed by the convention

## Options Considered

### Option 1: Mirror the code prop API exactly, in camelCase

Name every Figma property after its React prop, using the same casing and the same value strings (`variant`, `size`, `leadingIcon`; values `primary`, `ghost`).

**Pros:**

- Shortest possible mapping — for properties that have a code counterpart, there is nothing to map
- One vocabulary shared across design and implementation

**Cons:**

- camelCase is not readable in the Figma properties panel, which is where designers actually work
- Assumes a 1:1 correspondence that does not exist; there is no answer for properties with no code prop
- Couples the design library's vocabulary to implementation timing — a property cannot be named until code exists
- Where Figma leads, it forces either deleting real design work or blocking it on unwritten code

### Option 2: Title Case names plus one deterministic transform

Name properties and values in Title Case with single spaces, and define a single transform that derives a code identifier: collapse the spaces, camelCase. `Leading Icon` → `leadingIcon`, `High Contrast` → `highContrast`.

**Pros:**

- Readable in the properties panel
- One mechanical rule covers both names and values; no per-property lookup needed to resolve a name
- Fully machine-checkable, so it can be enforced in CI
- Independent of code's release timing — Figma can name a concept before a prop exists
- The mapping stays short: for aligned properties it is the transform, and nothing else

**Cons:**

- A mapping layer is still required, and always will be
- The transform must be kept injective; two properties deriving the same identifier is a real defect that has to be checked for
- A typo that happens to be valid Title Case passes the mechanical check, so a glossary is still needed for meaning

### Option 3: Document the current names without changing them

Publish a reference of what each property is called today and leave the library as is.

**Pros:**

- Zero migration cost and zero risk to existing files

**Cons:**

- Consumers still re-derive the mapping per component; the documentation goes stale the moment anyone adds a property
- Leaves genuine defects in place — colliding identifiers, dead properties, and property surfaces advertising states that have no variant

## Decision

**Adopt Option 2. Figma component properties follow one internally consistent convention: the same concept is named the same way on every component, and a property's name and values are mechanically derivable.**

Internal consistency is the objective. This is explicitly _not_ an attempt to reach parity with code. What the convention does is make the Figma side of the mapping predictable, so it can be written once and stay stable. Where a well-named code counterpart already exists, reusing its name is sensible and shortens the mapping — but it is a convenience, not a rule, and it never overrides the library's own consistency.

### 1. Casing, and the one transform

Property names and enum values are **Title Case with single spaces**. One transform derives a code identifier: **collapse the spaces, camelCase**.

| Figma            | Derives        |
| ---------------- | -------------- |
| `Leading Icon`   | `leadingIcon`  |
| `High Contrast`  | `highContrast` |
| `Has Close Icon` | `hasCloseIcon` |

No kebab-case anywhere. Every word is capitalised, separated by exactly one space, with no punctuation and nothing that cannot begin an identifier — `Optional/Required`, `Title + Description` and `Read-only` are all invalid because they derive nothing usable.

**Exception:** boolean values are lowercase `false` / `true`. They are code literals, not display labels, and they derive `false` / `true` with no transform. This is the only place Title Case does not apply.

### 2. Naming by property type

Figma has **five** property types.

| Type                               | Named after                    | Examples                                                       |
| ---------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| Variant                            | the concept the axis expresses | `Variant`, `Tone`, `Size`, `State`, `Composition`, `Selection` |
| Boolean — visibility               | `Has` + what it reveals        | `Has Label`, `Has Leading Icon`, `Has Helper Message`          |
| Boolean — mirroring a code boolean | the prop name, no prefix       | `Invalid`, `Disabled`                                          |
| Instance swap                      | the slot                       | `Leading Icon`, `Trailing Icon`, `Icon`                        |
| Text                               | the content                    | `Label`, `Placeholder`, `Value`, `Description`                 |
| Slot                               | the content hole               | `Slot`                                                         |

`Has` states **presence** — not an action, and not suppression. Prefer `Has Label` over `Show Label`, and never invert to `No Label` or `Hide Label`: code models these as optional content, so presence is the honest reading and it maps without negation.

### 3. Decorator glyphs

Leading glyphs (`↳`, `💠`, and the `.` / `_` privacy prefixes) are a deliberate visual cue in the properties panel and are kept. They are stripped before the transform, and by consumers on import.

- Allowed as a **leading prefix only**. `Show ↳ Label` is invalid.
- Whitespace is only legal immediately after a glyph — a stray leading space is not a decorator.
- One glyph for nesting: `↳`.
- **A glyph must never be the only thing distinguishing two properties** (see rule 4).

### 4. Uniqueness

**No two properties on a component may derive the same identifier**, once decorators are stripped. This is a correctness rule, not a style preference: a colliding pair survives in Figma and collapses on import.

The common shape is a slot and the boolean that reveals it. `Leading Icon` (instance swap) plus `Leading Icon` (boolean) collide; `Leading Icon` plus `Has Leading Icon` do not. This is why the `Has` prefix is mandatory rather than cosmetic.

### 5. One canonical name per concept

A concept has exactly one name across the library. No synonyms.

- The appearance axis is always `Variant` — never `Variants`, `Style`, `Type` or `Kind`.
- The preset axis on components offering a compose-your-own escape is always `Composition`, with `💠 Custom` as the value that exposes the author-controlled slots.
- The colour axis is always `Tone`; the emphasis ladder is always `Emphasis`.
- Interaction pseudo-states are always `State`; selection state is `Selection`.

Value sets may legitimately differ per component — `Variant` on Button and on Badge describe different things, and a ladder may use a subset of its rungs. What must not differ is the **axis name** for a given concept, and the meaning of a rung word within a ladder (`Low` < `Medium` < `High`; `Small` < `Medium` < `Large`).

Three names that look like duplicates but are not: `Text` is a component's own content (maps to `children`), `Label` is a label for a control (maps to a `label` prop), and `Title` is a heading inside a composite. Collapsing them would lose information.

### 6. Variant value order is functional

**The first value in a variant axis is the default Figma applies when the component is inserted from the assets picker.** Order encodes intent, is chosen deliberately per component, and must never be normalised.

- Only the _spelling_ of boolean values is canonical. `false / true` and `true / false` are both correct; which comes first is a design decision.
- **Renaming a value can move its position**, because value order is re-derived rather than preserved. Any value retitle must check the first value before and after, and treat a change in position 1 as a functional change.

### 7. Every property is declared mapping or Figma-only

Because parity is not the goal, each property carries an explicit classification so consumers never have to guess:

- **Mapping** — corresponds to a code prop: `Value`, `Invalid`, `Placeholder`, `Tone`.
- **Mapping-partial** — some values correspond, others do not. `State` is the main case: `Disabled` maps to `disabled`, `Read Only` to `readOnly`, and `Hover` / `Focus` / `Active` / `Filled` map to nothing.
- **Figma-only** — an authoring or presentation affordance with no code counterpart: `Has Focus Frame`, `Composition` presets, item-count axes.

### 8. The property surface must not promise what does not exist

A component's property list is a contract. If it advertises a combination that has no variant, a consumer will generate an unreachable state.

- **Two booleans where the grid implements only three of four combinations** should be one multi-value axis instead. Checkbox's `Checked` + `Indeterminate` became `Selection: Unchecked / Checked / Indeterminate` for exactly this reason — it had advertised 32 combinations and implemented 24.
- **Properties wired on only some variants** should say so in the component description. This is unavoidable on a preset axis where only `💠 Custom` exposes the slots.
- A property declared but referenced by **no** layer is dead weight. Delete it.

### 9. The `#id` suffix

Non-variant properties are returned by the API as `Name#nodeId` — `Value#4732:2`. Variant properties have no suffix. Consumers must split on `#`.

This makes rename risk asymmetric, which sets the migration order:

- Renaming a **text, boolean, instance-swap or slot** property is safe — the id is stable and instances stay wired.
- Renaming a **variant** property or value silently breaks anything referencing it as a string. Batch these behind a version bump.

### 10. Property order

Property order as reported by the API is **creation order**, and it cannot be set through the Plugin API. Grouping related properties — a slot next to the boolean that reveals it — is worth doing by hand for legibility, but it is guidance only. It is not enforceable and is not a rule.

### Canonical glossary

| Concept                   | Name                             | Type          | Notes                                                                       |
| ------------------------- | -------------------------------- | ------------- | --------------------------------------------------------------------------- |
| Appearance                | `Variant`                        | Variant       | values are component-specific                                               |
| Preset / compose-your-own | `Composition`                    | Variant       | `💠 Custom` exposes the slots                                               |
| Colour                    | `Tone`                           | Variant       | `Neutral`, `Accent`, `Success`, `Warning`, `Info`, `Danger` — never `Error` |
| Emphasis ladder           | `Emphasis`                       | Variant       | `Low` < `Medium` < `High`                                                   |
| Size ladder               | `Size`                           | Variant       | `Small` < `Medium` < `Large`; `Default` where a code prop uses it           |
| Interaction state         | `State`                          | Variant       | mapping-partial                                                             |
| Selection state           | `Selection`                      | Variant       | `Unchecked` / `Checked` / `Indeterminate`                                   |
| Checked (binary)          | `Checked`                        | Variant       | `false` / `true`                                                            |
| Validity                  | `Invalid`                        | Variant       | `false` / `true`                                                            |
| Layout direction          | `Layout`                         | Variant       |                                                                             |
| Required marker           | `Indicator`                      | Variant       | `Optional` / `Required`                                                     |
| Label text                | `Label`                          | Text          | `↳ Label` when nested                                                       |
| Description text          | `Description`                    | Text          | `↳ Description` when nested                                                 |
| Helper text               | `Helper Message`                 | Text          | `↳ Helper Message` when nested                                              |
| Input value               | `Value`                          | Text          |                                                                             |
| Placeholder               | `Placeholder`                    | Text          |                                                                             |
| Component's own content   | `Text`                           | Text          | maps to `children`                                                          |
| Heading in a composite    | `Title`                          | Text          |                                                                             |
| Leading / trailing slot   | `Leading Icon` / `Trailing Icon` | Instance swap |                                                                             |
| Generic icon slot         | `Icon`                           | Instance swap |                                                                             |
| Slot visibility           | `Has ` + slot name               | Boolean       | `Has Label`, `Has Leading Icon`                                             |
| Content hole              | `Slot`                           | Slot          |                                                                             |

New names are added to the glossary before being used in the file.

### Constraints imposed by Figma

Recorded so they are not rediscovered:

- A **boolean** binds only to layer visibility. It cannot restyle a component — which is why `Disabled` and `Read Only` cannot be lifted out of `State` and remain variant values.
- **Variant value order** is not settable through the Plugin API, only in the UI, and it determines the insert default.
- **Property order** is not settable at all; the API reports creation order.
- **Slots** are shared across variants by deleting the slot properties and re-assigning the frame as a slot. Copying a slot layer between variants mints a new id, which splits the property and loses content on variant switch.
- Renaming a value can change its position, and therefore the default.

### Enforcement

The convention is mechanical, so it is machine-checkable — and it needs to be. A linter reads the library and checks name shape, value shape, boolean spelling, the `Has` prefix, uniqueness of derived identifiers, and dead properties. It is scoped by component tier:

| Prefix   | Meaning                                                | Enforcement                                   |
| -------- | ------------------------------------------------------ | --------------------------------------------- |
| _(none)_ | published                                              | error                                         |
| `_`      | unfinished                                             | warning; error on the PR that removes the `_` |
| `.`      | sub-component — permanent, and visible through nesting | error                                         |

The linter cannot catch everything: a typo that is valid Title Case passes, and so does a name that is internally consistent but means the wrong thing. The linter enforces shape; the glossary enforces meaning. Both are needed.

### Rollout

The convention has been applied to the whole library on a Figma branch: the appearance axis consolidated to `Variant`, `Variants` / `Style` / `Type` retired, the input family unified, all booleans on `Has`, dead properties removed, boolean values normalised, slots unified on `Slot`, and the one live identifier collision resolved. 31% of properties failed a mechanical rule before; 2 of 191 do now, and both are deliberate Figma-only axes with no identifier to derive.

Adopt the convention for new component designs immediately. Migrate remaining components as they go through the EDS 2.0 upgrade, highest-usage first.

## Related

- Issue: [equinor/design-system#4974](https://github.com/equinor/design-system/issues/4974)
- Component priority matrix: discussion #4962
- Figma Plugin API: `componentPropertyDefinitions`, `componentPropertyReferences`
- Figma MCP: `get_design_context`, `get_variable_defs`
