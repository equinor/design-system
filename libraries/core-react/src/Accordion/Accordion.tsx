import React, { forwardRef, useMemo, ReactElement } from 'react'
import createId from 'lodash/uniqueId'
import type { AccordionProps } from './Accordion.types'

const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & JSX.IntrinsicElements['div']
>(function EdsAccordion(
  { headerLevel = 'h2', chevronPosition = 'left', children, ...props },
  ref,
) {
  const accordionId = useMemo<string>(() => createId('accordion-'), [])

  const AccordionItems = React.Children.map(children, (child, index) => {
    return React.cloneElement(child as ReactElement, {
      accordionId,
      index,
      headerLevel,
      chevronPosition,
    })
  })

  return (
    <div {...props} ref={ref}>
      {AccordionItems}
    </div>
  )
})

// Accordion.displayName = 'Accordion'

export { Accordion }
