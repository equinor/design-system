import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

const AccordionItem = forwardRef(function AccordionItem(
  {
    headerLevel,
    chevronPosition,
    index,
    accordionId,
    isExpanded,
    children,
    disabled,
    focusVisible,
    handleFocusVisible,
    ...props
  },
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
          toggleExpanded,
          id: headerId,
          panelId,
          headerLevel,
          chevronPosition,
          parentIndex: index,
          disabled,
          focusVisible,
          handleFocusVisible,
        })
      : React.cloneElement(child, {
          hidden: !expanded,
          id: panelId,
          headerId,
        })
  })

  return (
    <div {...props} ref={ref}>
      {Children}
    </div>
  )
})

AccordionItem.displayName = 'eds-accordion-item'

AccordionItem.propTypes = {
  ...commonPropTypes,
  /** The ID of the Accordion */
  accordionId: PropTypes.string,
  /** Is AccordionItem expanded */
  isExpanded: PropTypes.bool,
  /** The AccordionItem’s index in the Accordion */
  index: PropTypes.number,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** accordion item is disabled */
  disabled: PropTypes.bool,
  /** @ignore */
  focusVisible: PropTypes.bool,
  /** @ignore */
  handleFocusVisible: PropTypes.func,
}

AccordionItem.defaultProps = {
  ...commonDefaultProps,
  disabled: false,
  index: 0,
  accordionId: '',
  isExpanded: false,
  focusVisible: true,
  handleFocusVisible: () => {},
}

export { AccordionItem }
