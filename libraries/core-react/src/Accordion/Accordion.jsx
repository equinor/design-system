import React, { forwardRef, useMemo } from 'react'
import createId from 'lodash/uniqueId'
import PropTypes from 'prop-types'

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
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** Which side the chevron should be on  */
  chevronPosition: PropTypes.oneOf(['left', 'right']),
  /** The header level, i.e. h1, h2, h3 etc. */
  headerLevel: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  /** @ignore */
  className: PropTypes.string,
}

Accordion.defaultProps = {
  chevronPosition: 'left',
  headerLevel: 'h2',
  className: '',
}

export { Accordion }
