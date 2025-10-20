import { forwardRef } from 'react'
import {
  TextProps,
  HeadingProps,
  ParagraphProps,
  FontFamily,
  FontSize,
  LineHeight,
  BaselineAlignment,
  FontWeight,
  Tracking,
} from './Text.types'
import './text.css'

type BuildClassNameParams = {
  family: FontFamily
  size: FontSize
  baseline: BaselineAlignment
  lineHeight?: LineHeight
  weight?: FontWeight
  tracking?: Tracking
  className?: string
}

const buildClassName = ({
  family,
  size,
  lineHeight,
  baseline,
  weight,
  tracking,
  className,
}: BuildClassNameParams): string => {
  const classes = []

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

/**
 * Text component for flexible typography with baseline grid support.
 *
 * Can be used with individual props (family, size, lineHeight, baseline, weight, tracking)
 * or with a predefined variant.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      family,
      size,
      baseline,
      lineHeight,
      weight,
      tracking,
      debug,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const Component = 'span'
    const combinedClassName = buildClassName({
      family,
      size,
      baseline,
      lineHeight,
      weight,
      tracking,
      className,
    })

    return (
      <Component
        ref={ref as React.Ref<HTMLSpanElement>}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

Text.displayName = 'Text'

const getHeadingSize = (as: HeadingProps['as']): FontSize => {
  switch (as) {
    case 'h1':
      return '6xl'
    case 'h2':
      return '5xl'
    case 'h3':
      return '4xl'
    case 'h4':
      return '3xl'
    case 'h5':
      return '2xl'
    case 'h6':
      return 'xl'
    default:
      return '6xl'
  }
}

/**
 * Heading component (h1-h6) with typography support.
 * Always uses the header font family. Size and line-height are opinionated and not configurable.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      weight = 'normal',
      tracking = 'normal',
      debug,
      className,
      children,
      as = 'h1',
      ...rest
    },
    ref,
  ) => {
    const combinedClassName = buildClassName({
      family: 'header',
      size: getHeadingSize(as),
      baseline: 'grid',
      weight,
      tracking,
      className,
    })

    const Component = as

    return (
      <Component
        ref={ref}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

Heading.displayName = 'Heading'

/**
 * Paragraph component with typography support.
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    {
      size = 'md',
      lineHeight = 'default',
      weight = 'normal',
      tracking = 'normal',
      debug,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const combinedClassName = buildClassName({
      family: 'ui',
      baseline: 'grid',
      lineHeight,
      size,
      weight,
      tracking,
      className,
    })

    return (
      <p
        ref={ref}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </p>
    )
  },
)

Paragraph.displayName = 'Paragraph'
