import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { bordersTemplate, spacingsTemplate } from '../../utils'

export type AccordionPanelProps = {
  /** The ID of the element that controls the panel */
  headerId?: string
  /** The ID of the panel */
  id?: string
  /** If `true`, the panel will be hidden. */
  hidden?: boolean
} & HTMLAttributes<HTMLDivElement>

type StyledAccordionPanelProps = Pick<AccordionPanelProps, 'headerId'>

const StyledAccordionPanel = styled.div.attrs(
  ({ headerId }: StyledAccordionPanelProps): JSX.IntrinsicElements['div'] => ({
    role: 'region',
    'aria-labelledby': headerId,
  }),
)<StyledAccordionPanelProps>(({ theme }) => {
  const {
    entities: { header, panel, border },
  } = theme
  return css`
    ${bordersTemplate(border)}
    ${spacingsTemplate(panel.spacings)}
    background: ${header.background};
    min-height: 96px;
    box-sizing: border-box;
  `
})

const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
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
