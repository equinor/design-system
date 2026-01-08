import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../../Icon'
import { chevron_down } from '@equinor/eds-icons'

export type AccordionHeaderProps = {
  /** Header content */
  children?: ReactNode
} & HTMLAttributes<HTMLElement>

/**
 * Accordion header - renders as <summary> element.
 * Maps to .⌘ Accordion internal Figma component.
 *
 * @example
 * <Accordion.Header>Section Title</Accordion.Header>
 */
export const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(
  function AccordionHeader({ className, children, ...rest }, ref) {
    const classNames = ['accordion__header', className]
      .filter(Boolean)
      .join(' ')

    return (
      <summary ref={ref} className={classNames} {...rest}>
        <span className="accordion__header-title">{children}</span>
        <Icon data={chevron_down} className="accordion__icon" size={24} />
        {/* Focus frame - matches Figma Focus Frame with inset: -1px */}
        <span className="accordion__focus-frame" aria-hidden="true" />
      </summary>
    )
  },
)
