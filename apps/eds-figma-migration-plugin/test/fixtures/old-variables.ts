/**
 * Every published variable in the deprecated libraries, rebuilt from the
 * patterns its names follow. The counts below were read with
 * `figma.teamLibrary` on 2026-11-11; the test asserts that the patterns give
 * the same number of names, so a missing pattern shows up.
 */
import { OLD } from '../../src/mapping/inventory'
import type { OldVariable } from '../../src/mapping/types'

const TONE_NAMES = ['Accent', 'Danger', 'Info', 'Neutral', 'Success', 'Warning']
const OLD_STEPS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
]
const SPACING_STEPS = [
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
]
const INSET_SIZES = ['xs', 'sm', 'md', 'lg', 'xl']
const TYPE_PROPERTIES = [
  'cap-rounded',
  'font-size',
  'font-weight-bolder',
  'font-weight-lighter',
  'font-weight-normal',
  'line-height-default',
  'line-height-squished',
  'padding-baselined',
  'padding-centred',
  'tracking-normal',
  'tracking-tight',
  'tracking-wide',
]

const colour = (collectionKey: string, name: string): OldVariable => ({
  collectionKey,
  name,
  type: 'COLOR',
})
const float = (collectionKey: string, name: string): OldVariable => ({
  collectionKey,
  name,
  type: 'FLOAT',
})

export const STATIC_SEMANTIC: OldVariable[] = TONE_NAMES.flatMap((tone) => [
  ...['Canvas', 'Surface'].map((slot) => `Bg/${tone}/${slot}`),
  ...['Fill Emphasis', 'Fill Muted'].flatMap((fill) =>
    ['Active', 'Default', 'Hover'].map(
      (state) => `Bg/${tone}/${fill}/${state}`,
    ),
  ),
  ...['Medium', 'Strong', 'Subtle'].map((level) => `Border/${tone}/${level}`),
  ...['Strong', 'Subtle', 'Strong on emphasis', 'Subtle on emphasis'].map(
    (level) => `Text/${tone}/${level}`,
  ),
]).map((name) => colour(OLD.staticSemantic, name))

const CONCEPT_NAMES = [
  'Bg/Backdrop',
  'Bg/Disabled',
  'Bg/Floating',
  'Bg/Input',
  'Border/Disabled',
  'Border/Focus',
  'Text/Disabled',
  'Text/Link',
]
export const STATIC_CONCEPT = CONCEPT_NAMES.map((name) =>
  colour(OLD.staticConcept, name),
)
export const DYNAMIC_CONCEPT = CONCEPT_NAMES.map((name) =>
  colour(OLD.dynamicConcept, name),
)

export const APPEARANCE: OldVariable[] = [
  'Bg/Canvas',
  'Bg/Surface',
  ...['Emphasis', 'Muted'].flatMap((level) =>
    ['Active', 'Default', 'Disabled', 'Hover'].map(
      (state) => `Bg/Fill/${level}/${state}`,
    ),
  ),
  'Border/Disabled',
  'Border/Medium',
  'Border/Strong',
  'Border/Subtle',
  'Text/Disabled',
  'Text/Strong on emphasis',
  'Text/Strong',
  'Text/Subtle on emphasis',
  'Text/Subtle',
].map((name) => colour(OLD.appearance, name))

export const DENSITY: OldVariable[] = [
  ...OLD_STEPS.flatMap((step) => [
    `sizing/icon/${step}`,
    `sizing/icon/${step}-container`,
    `sizing/icon/${step}-container-padding-horisontal`,
    `sizing/icon/${step}-container-padding-vertical`,
    `spacing/icon/${step}/gap-horizontal`,
    `spacing/icon/${step}/gap-vertical`,
  ]),
  ...['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((s) => `sizing/selectable/${s}`),
  ...['none', 'thick', 'thin'].map((s) => `sizing/stroke/${s}`),
  ...['none', 'pill', 'rounded'].map((s) => `spacing/border-radius/${s}`),
  ...SPACING_STEPS.flatMap((step) => [
    `spacing/horizontal/${step}`,
    `spacing/vertical/${step}`,
  ]),
  ...INSET_SIZES.flatMap((size) =>
    [
      'horizontal',
      'vertical-squared',
      'vertical-squished',
      'vertical-stretched',
    ].map((part) => `spacing/inset/${size}/${part}`),
  ),
  ...['header', 'ui-body'].flatMap((family) =>
    OLD_STEPS.flatMap((step) =>
      TYPE_PROPERTIES.map(
        (property) => `typography/${family}/${step}/${property}`,
      ),
    ),
  ),
].map((name) => float(OLD.density, name))

export const DENSITY_STRINGS: OldVariable[] = [
  'typography/header/font-family',
  'typography/ui-body/font-family',
].map((name) => ({ collectionKey: OLD.density, name, type: 'STRING' }))

export const SPACING_SEMANTIC: OldVariable[] = [
  'Container/Gap horizontal',
  'Container/Gap vertical',
  'Container/Space horizontal',
  'Container/Space vertical',
  'Deprecated/Icon container size ⛔️',
  'Generic/Corner radius',
  'Generic/Gap horizontal',
  'Generic/Gap vertical',
  'Generic/Space horizontal',
  'Generic/Space vertical',
  'Generic/Stroke width',
  'Page/Gap horizontal',
  'Page/Gap vertical',
  'Page/Space horizontal',
  'Page/Space vertical',
  'Selectable/Gap horizontal',
  'Selectable/Gap vertical',
  'Selectable/Icon + text gap ↔︎',
  'Selectable/Icon + text gap ↕︎',
  'Selectable/Icon container padding ↔︎',
  'Selectable/Icon container padding ↕︎',
  'Selectable/Icon size',
  'Selectable/Size',
  'Selectable/Space horizontal',
  'Selectable/Space vertical',
  'Typography/Baseline adjust bottom',
  'Typography/Baseline adjust top',
  'Typography/Font size',
  'Typography/Font weight',
  'Typography/Line height',
  'Typography/Tracking',
].map((name) => float(OLD.spacingSemantic, name))

export const BOX: OldVariable[] = [
  'Border radius',
  'Gap horisontal',
  'Gap vertical',
  'Horisontal padding',
  'Icon container width',
  'Icon width',
  'Min height',
  'Min width',
  'Size (fixed)',
  'Stroke',
  'Vertical padding',
].map((name) => float(OLD.box, name))

/** Counts read from the deprecated libraries on 2026-11-11. */
export const PUBLISHED_COUNTS = {
  staticSemantic: 90,
  staticConcept: 8,
  dynamicConcept: 8,
  appearance: 19,
  density: 354,
  spacingSemantic: 32,
  box: 11,
}

export const ALL_COLOURS = [
  ...STATIC_SEMANTIC,
  ...STATIC_CONCEPT,
  ...DYNAMIC_CONCEPT,
  ...APPEARANCE,
]
