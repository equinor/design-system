import {
  FontFamily,
  FontSize,
  LineHeight,
  BaselineAlignment,
  FontWeight,
  Tracking,
} from './typography-types'

type BuildClassNameParams = {
  family?: FontFamily
  size?: FontSize
  baseline?: BaselineAlignment
  lineHeight?: LineHeight
  weight?: FontWeight
  tracking?: Tracking
  className?: string
}

/**
 * Builds a className string from typography properties
 */
export const buildClassName = ({
  family,
  size,
  lineHeight,
  baseline,
  weight,
  tracking,
  className,
}: BuildClassNameParams): string => {
  const classes: string[] = []

  if (family) {
    classes.push(`font-family-${family}`)
  }
  if (size) {
    classes.push(`text-${size}`)
  }
  if (lineHeight) {
    classes.push(`line-height-${lineHeight}`)
  }
  if (baseline) {
    classes.push(`text-baseline-${baseline}`)
  }
  if (weight) {
    classes.push(`font-${weight}`)
  }
  if (tracking) {
    classes.push(`tracking-${tracking}`)
  }

  if (className) {
    classes.push(className)
  }

  return classes.join(' ')
}
