import React, { forwardRef, useMemo, useState } from 'react'
import createId from 'lodash.uniqueid'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

const Accordion = forwardRef(function Accordion(
  { headerLevel, chevronPosition, children, ...props },
  ref,
) {
  const accordionId = useMemo(() => createId('accordion-'), [])

  const [focusVisible, setFocusVisible] = useState(false)

  const handleFocusVisible = (isFocusVisible) => {
    setFocusVisible(isFocusVisible)
  }

  const AccordionItems = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      accordionId,
      index,
      headerLevel,
      chevronPosition,
      focusVisible,
      handleFocusVisible,
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
