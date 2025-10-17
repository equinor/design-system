import { forwardRef } from 'react'
import {
  TextProps,
  HeadingProps,
  ParagraphProps,
  SpanProps,
} from './Text.types'
import './text.css'

const buildClassName = (
  baseClass: string,
  size?: string,
  lineHeight?: string,
  baseline?: string,
  weight?: string,
  variant?: string,
  className?: string,
  debug?: boolean,
): string => {
  const classes = [baseClass]

  if (variant) {
    classes.push(variant)
  } else {
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
  }

  if (className) {
    classes.push(className)
  }

  return classes.join(' ')
}

/**
 * Text component for flexible typography with baseline grid support.
 *
 * Can be used with individual props (size, lineHeight, baseline, weight)
 * or with a predefined variant.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      size,
      lineHeight,
      baseline,
      weight,
      variant,
      debug,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const Component = 'span'
    const combinedClassName = buildClassName(
      'text',
      size,
      lineHeight,
      baseline,
      weight,
      variant,
      className,
      debug,
    )

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

/**
 * Heading component (h1-h6) with typography support.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      size,
      lineHeight,
      baseline,
      weight,
      debug,
      className,
      children,
      as = 'h1',
      ...rest
    },
    ref,
  ) => {
    const combinedClassName = buildClassName(
      'text',
      size,
      lineHeight,
      baseline,
      weight,
      undefined,
      className,
      debug,
    )

    const props = {
      ref,
      className: combinedClassName,
      'data-debug': debug ? '' : undefined,
      ...rest,
    }

    switch (as) {
      case 'h1':
        return <h1 {...props}>{children}</h1>
      case 'h2':
        return <h2 {...props}>{children}</h2>
      case 'h3':
        return <h3 {...props}>{children}</h3>
      case 'h4':
        return <h4 {...props}>{children}</h4>
      case 'h5':
        return <h5 {...props}>{children}</h5>
      case 'h6':
        return <h6 {...props}>{children}</h6>
      default:
        return <h1 {...props}>{children}</h1>
    }
  },
)

Heading.displayName = 'Heading'

/**
 * Paragraph component with typography support.
 */
export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    { size, lineHeight, baseline, weight, debug, className, children, ...rest },
    ref,
  ) => {
    const combinedClassName = buildClassName(
      'text',
      size,
      lineHeight,
      baseline,
      weight,
      undefined,
      className,
      debug,
    )

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

/**
 * Span component with typography support.
 */
export const Span = forwardRef<HTMLSpanElement, SpanProps>(
  (
    { size, lineHeight, baseline, weight, debug, className, children, ...rest },
    ref,
  ) => {
    const combinedClassName = buildClassName(
      'text',
      size,
      lineHeight,
      baseline,
      weight,
      undefined,
      className,
      debug,
    )

    return (
      <span
        ref={ref}
        className={combinedClassName}
        data-debug={debug ? '' : undefined}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

Span.displayName = 'Span'
