import React, { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import createId from 'lodash.uniqueid'
import { accordion as tokens } from './Accordion.tokens'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

const Accordion = forwardRef(function Accordion(
  { headerLevel, chevronPosition, children, ...props },
  ref,
) {
  const accordionId = useMemo(() => createId('accordion-'), [])

  const AccordionItems = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
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

Accordion.displayName = 'eds-accordion'

Accordion.propTypes = {
  ...commonPropTypes,
}

Accordion.defaultProps = {
  ...commonDefaultProps,
}

export { Accordion }
