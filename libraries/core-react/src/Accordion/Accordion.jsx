import React, { forwardRef, useMemo } from 'react'
import createId from 'lodash.uniqueid'
import PropTypes from 'prop-types'

const Accordion = forwardRef(
  /**
   * @param {import('./Accordion.propTypes').CommonProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function Accordion({ headerLevel, chevronPosition, children, ...rest }, ref) {
    const accordionId = useMemo(() => createId('accordion-'), [])

    const AccordionItems = React.Children.map(children, (child, index) => {
      return React.cloneElement(
        /** @type {React.ReactElement<any>} */ (child),
        {
          accordionId,
          index,
          headerLevel,
          chevronPosition,
        },
      )
    })

    return (
      <div {...rest} ref={ref}>
        {AccordionItems}
      </div>
    )
  },
)

Accordion.displayName = 'eds-accordion'

Accordion.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** Which side the chevron should be on  */
  // @ts-ignore
  chevronPosition: PropTypes.oneOf(['left', 'right']),
  /** The header level, i.e. h1, h2, h3 etc. */
  // @ts-ignore
  headerLevel: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  /** @ignore */
  className: PropTypes.string,
}

Accordion.defaultProps = {
  // @ts-ignore
  chevronPosition: 'left',
  // @ts-ignore
  headerLevel: 'h2',
  className: '',
}

export { Accordion }
