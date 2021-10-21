import {
  forwardRef,
  ReactElement,
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
} from 'react'
import type { AccordionProps } from './Accordion.types'
import { useId } from '../../hooks'

const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & HTMLAttributes<HTMLDivElement>
>(function Accordion(
  { headerLevel = 'h2', chevronPosition = 'left', children, id, ...props },
  ref,
) {
  const accordionId = useId(id, 'accordion')

  const AccordionItems = ReactChildren.map(children, (child, index) => {
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
