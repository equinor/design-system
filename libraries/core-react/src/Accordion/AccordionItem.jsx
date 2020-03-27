import React, { forwardRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { AccordionHeader as Header } from './AccordionHeader'
import { AccordionPanel as Panel } from './AccordionPanel'
import { accordion as tokens } from './Accordion.tokens'

const StyledAccordionItem = styled.div`
  background: silver;
`

const AccordionItem = forwardRef(function AccordionItem(
  { index, accordionId, isExpanded, children, ...props },
  ref,
) {
  const [expanded, setExpanded] = useState(isExpanded)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const Children = React.Children.map(children, (child, childIndex) => {
    const headerId = `${accordionId}-header-${index + 1}`
    const panelId = `${accordionId}-panel-${index + 1}`

    return childIndex === 0
      ? React.cloneElement(child, {
          isExpanded: expanded,
          onClick: toggleExpanded,
          id: headerId,
          panelId,
        })
      : React.cloneElement(child, {
          hidden: !expanded,
          id: panelId,
          headerId,
        })
  })

  return (
    <StyledAccordionItem {...props} ref={ref}>
      {Children}
    </StyledAccordionItem>
  )
})

AccordionItem.displayName = 'eds-accordion-item'

AccordionItem.propTypes = {
  /** The ID of the Accordion */
  accordionId: PropTypes.string,
  /** Is AccordionItem expanded */
  isExpanded: PropTypes.bool,
  /** The AccordionItem’s index in the Accordion */
  index: PropTypes.number,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

AccordionItem.defaultProps = {
  index: 0,
  accordionId: '',
  isExpanded: false,
  className: null,
}

export { AccordionItem }
