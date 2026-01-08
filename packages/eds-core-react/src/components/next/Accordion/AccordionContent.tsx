import { forwardRef, HTMLAttributes } from 'react'

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>

/**
 * Accordion content - the expandable content area.
 *
 * @example
 * <Accordion.Content>Your content here</Accordion.Content>
 */
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(function AccordionContent({ className, children, ...rest }, ref) {
  const classNames = ['accordion__content', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className="accordion__content-wrapper">
      <div className={classNames} {...rest}>
        {children}
      </div>
    </div>
  )
})
