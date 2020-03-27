import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import createId from 'lodash.uniqueid'
import { accordion as tokens } from './Accordion.tokens'

const StyledAccordion = styled.div`
  background: pink;
`

const Accordion = forwardRef(function Accordion({ children, ...props }, ref) {
  const accordionId = useMemo(() => createId('accordion-'), [])

  const AccordionItems = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      accordionId,
      index,
    })
  })

  return (
    <StyledAccordion {...props} ref={ref}>
      {AccordionItems}
    </StyledAccordion>
  )
})

Accordion.displayName = 'eds-accordion'

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
}

Accordion.defaultProps = {}

export { Accordion }
