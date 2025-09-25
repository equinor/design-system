import {
  forwardRef,
  ReactElement,
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
} from 'react'
import { ThemeProvider } from 'styled-components'
import type { AccordionProps } from './Accordion.types'
import { accordion as tokens } from './Accordion.tokens'
import { useId, useToken } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'

const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & HTMLAttributes<HTMLDivElement>
>(function Accordion(
  { headerLevel = 'h2', chevronPosition = 'left', children, id, ...props },
  ref,
) {
  const accordionId = useId(id, 'accordion')
  const { density } = useEds()
  const token = useToken({ density }, tokens)

  const AccordionItems = ReactChildren.map(children, (child, index) => {
    if (!child) return null
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      accordionId,
      index,
      headerLevel,
      chevronPosition,
    })
  })

  return (
    <ThemeProvider theme={token}>
      <div {...props} ref={ref}>
        {AccordionItems}
      </div>
    </ThemeProvider>
  )
})

// Accordion.displayName = 'Accordion'

export { Accordion }
