import { forwardRef } from 'react'
import { HeadingProps } from './Heading.types'
import { FontSize } from './typography-types'
import { buildClassName } from './typography-utils'

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
