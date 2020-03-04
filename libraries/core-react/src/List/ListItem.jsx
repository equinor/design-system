import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

/**
 * @typedef {object} Props
 * @prop {React.ReactNode} children
 * @prop {string} [className]
 */

const ListItem = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function ListItem({ children, ...rest }, ref) {
    return (
      <li {...rest} ref={ref}>
        {children}
      </li>
    )
  },
)

ListItem.displayName = 'eds-listitem'

ListItem.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

ListItem.defaultProps = {
  className: undefined,
}

export { ListItem }
