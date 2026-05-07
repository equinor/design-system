/**
 * Runtime composer for the EDS 2.0 five-axis typography system.
 *
 * EDS typography is composed at runtime from five orthogonal axes:
 * font-family × font-size × font-weight × line-height × tracking. In CSS the
 * cascade resolves these via `data-*` attributes; non-CSS consumers (RN, plain
 * JS) need this helper because Style Dictionary cannot represent runtime
 * mode switching as static data.
 *
 * The matrix data is sourced from the package's own build output:
 *   - `build/ts/typography/font-family-{ui,header}.ts` — full size matrix per
 *     family, the only correct source for family-dependent values.
 *   - `build/ts/typography/size-extras.ts` — family-independent size-axis
 *     extras (iconSize, gapHorizontal, gapVertical) per size.
 *
 * These files are regenerated from Figma by `pnpm run build:variables` and
 * are committed to the repo. The helper has no hardcoded values — Figma is
 * the source of truth.
 */

import { typography as uiBodyMatrix } from '../../build/ts/typography/font-family-ui'
import { typography as headerMatrix } from '../../build/ts/typography/font-family-header'
import { sizeExtras } from '../../build/ts/typography/size-extras'

export type FontFamily = 'ui' | 'header'

export type FontSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

export type FontWeight = 'lighter' | 'normal' | 'bolder'

export type LineHeightVariant = 'default' | 'squished'

export type Tracking = 'tight' | 'normal' | 'wide' | 'loose'

export type ComposeFormat = 'css' | 'react-native'

export interface ComposeTextStyleOptions {
  fontFamily: FontFamily
  fontSize: FontSize
  fontWeight?: FontWeight
  lineHeight?: LineHeightVariant
  tracking?: Tracking
  format?: ComposeFormat
  /**
   * When true the result also includes `iconSize`, `gapHorizontal`, and
   * `gapVertical` — values that scale with font-size in the EDS density
   * system. These are family-independent.
   */
  includeSizeExtras?: boolean
}

export interface CssTextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
}

export interface CssTextStyleWithExtras extends CssTextStyle {
  iconSize: number
  gapHorizontal: number
  gapVertical: number
}

export interface ReactNativeTextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: '300' | '400' | '500'
  lineHeight: number
  letterSpacing: number
}

export interface ReactNativeTextStyleWithExtras extends ReactNativeTextStyle {
  iconSize: number
  gapHorizontal: number
  gapVertical: number
}

const FAMILY_MATRICES = {
  ui: uiBodyMatrix,
  header: headerMatrix,
} as const

// Family files use camelCase keys (twoXl, threeXl, ...) for sizes that begin
// with a digit. Mirror that naming when indexing into fontFamilySize.
const FAMILY_SIZE_KEY = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': 'twoXl',
  '3xl': 'threeXl',
  '4xl': 'fourXl',
  '5xl': 'fiveXl',
  '6xl': 'sixXl',
} as const satisfies Record<FontSize, string>

const FONT_FAMILIES: readonly FontFamily[] = ['ui', 'header']
const FONT_SIZES: readonly FontSize[] = [
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
const FONT_WEIGHTS: readonly FontWeight[] = ['lighter', 'normal', 'bolder']
const LINE_HEIGHTS: readonly LineHeightVariant[] = ['default', 'squished']
const TRACKINGS: readonly Tracking[] = ['tight', 'normal', 'wide', 'loose']
const FORMATS: readonly ComposeFormat[] = ['css', 'react-native']

function assertOneOf<T extends string>(
  axis: string,
  value: T,
  allowed: readonly T[],
): void {
  if (!allowed.includes(value)) {
    throw new RangeError(
      `composeTextStyle: invalid ${axis} "${String(value)}". Expected one of: ${allowed.join(', ')}.`,
    )
  }
}

interface FamilyRow {
  fontSize: number
  fontWeightLighter: number
  fontWeightNormal: number
  fontWeightBolder: number
  lineHeightDefault: number
  lineHeightSquished: number
  trackingTight: number
  trackingNormal: number
  trackingWide: number
}

function getRow(family: FontFamily, size: FontSize): FamilyRow {
  const matrix = FAMILY_MATRICES[family]
  const key = FAMILY_SIZE_KEY[size] as keyof typeof matrix.fontFamilySize
  return matrix.fontFamilySize[key]
}

function pickFontWeight(row: FamilyRow, weight: FontWeight): number {
  switch (weight) {
    case 'lighter':
      return row.fontWeightLighter
    case 'bolder':
      return row.fontWeightBolder
    default:
      return row.fontWeightNormal
  }
}

function pickLineHeight(row: FamilyRow, lh: LineHeightVariant): number {
  return lh === 'squished' ? row.lineHeightSquished : row.lineHeightDefault
}

function pickTracking(row: FamilyRow, tracking: Tracking): number {
  switch (tracking) {
    case 'tight':
      return row.trackingTight
    case 'wide':
    case 'loose':
      // Tracking.Loose aliases Tracking.Wide in the Figma source — both
      // resolve to the same value at every cell of the matrix today.
      return row.trackingWide
    default:
      return row.trackingNormal
  }
}

/**
 * Compose a fully-resolved text style from the EDS 2.0 typography axes.
 *
 * @example CSS-shape (default)
 * ```ts
 * const style = composeTextStyle({ fontFamily: 'ui', fontSize: 'md' })
 * // { fontFamily: 'Inter', fontSize: 14, fontWeight: 400,
 * //   lineHeight: 20, letterSpacing: 0 }
 * ```
 *
 * @example React Native
 * ```ts
 * const style = composeTextStyle({
 *   fontFamily: 'ui',
 *   fontSize: 'md',
 *   format: 'react-native',
 * })
 * // fontWeight is '400' (string) instead of 400 (number)
 * ```
 *
 * @example With size extras
 * ```ts
 * const style = composeTextStyle({
 *   fontFamily: 'ui',
 *   fontSize: 'md',
 *   includeSizeExtras: true,
 * })
 * // also returns iconSize, gapHorizontal, gapVertical
 * ```
 *
 * @throws RangeError when any axis value is not in its allowed set.
 */
export function composeTextStyle(
  options: ComposeTextStyleOptions & {
    format?: 'css'
    includeSizeExtras: true
  },
): Readonly<CssTextStyleWithExtras>
export function composeTextStyle(
  options: ComposeTextStyleOptions & {
    format: 'react-native'
    includeSizeExtras: true
  },
): Readonly<ReactNativeTextStyleWithExtras>
export function composeTextStyle(
  options: ComposeTextStyleOptions & { format: 'react-native' },
): Readonly<ReactNativeTextStyle>
export function composeTextStyle(
  options: ComposeTextStyleOptions & { format?: 'css' },
): Readonly<CssTextStyle>
export function composeTextStyle(
  options: ComposeTextStyleOptions,
): Readonly<
  | CssTextStyle
  | CssTextStyleWithExtras
  | ReactNativeTextStyle
  | ReactNativeTextStyleWithExtras
> {
  const {
    fontFamily,
    fontSize,
    fontWeight = 'normal',
    lineHeight = 'default',
    tracking = 'normal',
    format = 'css',
    includeSizeExtras = false,
  } = options

  assertOneOf('fontFamily', fontFamily, FONT_FAMILIES)
  assertOneOf('fontSize', fontSize, FONT_SIZES)
  assertOneOf('fontWeight', fontWeight, FONT_WEIGHTS)
  assertOneOf('lineHeight', lineHeight, LINE_HEIGHTS)
  assertOneOf('tracking', tracking, TRACKINGS)
  assertOneOf('format', format, FORMATS)

  const matrix = FAMILY_MATRICES[fontFamily]
  const row = getRow(fontFamily, fontSize)

  const weightNumber = pickFontWeight(row, fontWeight)
  const baseStyle: CssTextStyle = {
    fontFamily: matrix.typography.fontFamily,
    fontSize: row.fontSize,
    fontWeight: weightNumber,
    lineHeight: pickLineHeight(row, lineHeight),
    letterSpacing: pickTracking(row, tracking),
  }

  const result =
    format === 'react-native'
      ? ({
          ...baseStyle,
          fontWeight: String(weightNumber),
        } as ReactNativeTextStyle)
      : baseStyle

  if (includeSizeExtras) {
    const extras = sizeExtras[fontSize]
    return Object.freeze({
      ...result,
      iconSize: extras.iconSize,
      gapHorizontal: extras.gapHorizontal,
      gapVertical: extras.gapVertical,
    })
  }
  return Object.freeze(result)
}
