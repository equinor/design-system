import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  ReactElement,
  HTMLAttributes,
} from 'react'
import createId from 'lodash/uniqueId'
import type { AccordionProps } from './Accordion.types'

const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & HTMLAttributes<HTMLDivElement>
>(function Accordion(
  { headerLevel = 'h2', chevronPosition = 'left', children, ...props },
  ref,
) {
  const accordionId = useMemo<string>(() => createId('accordion-'), [])

  const AccordionItems = Children.map(children, (child, index) => {
    if (!child) return null
    return cloneElement(child as ReactElement, {
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
