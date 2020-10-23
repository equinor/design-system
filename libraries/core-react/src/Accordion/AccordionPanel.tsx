import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { accordion as tokens } from './Accordion.tokens'

const {
  header: {
    background: { default: background },
  },
  border,
} = tokens

type Props = {
  /** The ID of the element that controls the panel */
  headerId?: string
  /** The ID of the panel */
  id?: string
  /** If `true`, the panel will be hidden. */
  hidden?: boolean
} & JSX.IntrinsicElements['div']

type StyledAccordionPanelProps = Pick<Props, 'headerId'>

const StyledAccordionPanel = styled.div.attrs(
  ({ headerId }: StyledAccordionPanelProps): JSX.IntrinsicElements['div'] => ({
    role: 'region',
    'aria-labelledby': headerId,
  }),
)<StyledAccordionPanelProps>`
  background: ${background};
  border-right: ${border};
  border-bottom: ${border};
  border-left: ${border};
  min-height: 96px;
  padding: 16px;
  box-sizing: border-box;
`

const AccordionPanel = forwardRef<HTMLDivElement, Props>(
  function AccordionPanel({ id, headerId, hidden, children, ...props }, ref) {
    return (
      <StyledAccordionPanel
        headerId={headerId}
        id={id}
        hidden={hidden}
        {...props}
        ref={ref}
      >
        {children}
      </StyledAccordionPanel>
    )
  },
)

// AccordionPanel.displayName = 'eds-accordion-panel'

export { AccordionPanel }
