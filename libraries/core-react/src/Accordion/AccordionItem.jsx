import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

/**
 * @typedef Props
 * @prop {string} [accordionId] The ID of the {@link Accordion}
 * @prop {boolean} [isExpanded] Is {@link AccordionItem} expanded
 * @prop {number} [index] The {@link AccordionItem}’s index in the {@link Accordion}
 * @prop {React.ReactNode} [children]
 * @prop {boolean} [disabled] {@link AccordionItem} is disabled
 */

const AccordionItem = forwardRef(
  /**
   * @param {Props & import('./Accordion.propTypes').CommonProps & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function AccordionItem(
    {
      headerLevel,
      chevronPosition,
      index,
      accordionId,
      isExpanded,
      children,
      disabled,
      ...rest
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
        ? React.cloneElement(/** @type {React.ReactElement<any>} */ (child), {
            isExpanded: expanded,
            toggleExpanded,
            id: headerId,
            panelId,
            headerLevel,
            chevronPosition,
            parentIndex: index,
            disabled,
          })
        : React.cloneElement(/** @type {React.ReactElement<any>} */ (child), {
            hidden: !expanded,
            id: panelId,
            headerId,
          })
    })

    return (
      <div {...rest} ref={ref}>
        {Children}
      </div>
    )
  },
)

AccordionItem.displayName = 'eds-accordion-item'

// @ts-ignore
AccordionItem.propTypes = {
  ...commonPropTypes,
  /** @ignore */
  accordionId: PropTypes.string,
  /** Is AccordionItem expanded */
  isExpanded: PropTypes.bool,
  /** @ignore */
  index: PropTypes.number,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** accordion item is disabled */
  disabled: PropTypes.bool,
}

// @ts-ignore
AccordionItem.defaultProps = {
  ...commonDefaultProps,
  disabled: false,
  index: 0,
  accordionId: '',
  isExpanded: false,
}

export { AccordionItem }
