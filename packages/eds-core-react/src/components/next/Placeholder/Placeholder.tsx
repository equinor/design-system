import { forwardRef } from 'react'
import type { PlaceholderProps, PlaceholderTone } from './Placeholder.types'
import './placeholder.css'

const baseClass = 'eds-next-placeholder'

const toneModifier = (tone: PlaceholderTone) =>
  tone === 'neutral' ? '' : `${baseClass}--${tone}`

/**
 * Temporary placeholder surface used for components living under the /next entry point.
 */
export const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  ({ tone = 'neutral', className = '', children, ...rest }, ref) => {
    const classes = [baseClass, toneModifier(tone), className]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={classes}
        data-color-appearance={tone === 'neutral' ? undefined : tone}
        {...rest}
      >
        {children ?? 'EDS 2.0 component placeholder'}
      </div>
    )
  },
)

Placeholder.displayName = 'Placeholder'
