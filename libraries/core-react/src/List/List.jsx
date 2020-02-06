import React, { forwardRef } from 'react'
import PropTypes, { resetWarningCache } from 'prop-types'
import styled, { css } from 'styled-components'

const StyledList = styled.div(
  ({ as }) =>
    as === 'ol' &&
    css`
      & ol {
        list-style-type: lower-alpha;
      }
    `,
)

const variants = {
  bullet: 'ul',
  numbered: 'ol',
}

const List = forwardRef(function List(
  { children, variant, className, ...props },
  ref,
) {
  return (
    <StyledList
      as={variants[variant]}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </StyledList>
  )
})

List.displayName = 'eds-list'

List.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Variant */
  variant: PropTypes.oneOf(['bullet', 'numbered']),
  /** An integer to start counting from for the list items */
  start: (props, propName, componentName) => {
    const prop = props[propName]
    let error
    if (props.variant !== 'numbered' && prop !== undefined) {
      error = new Error(
        `Invalid prop "${propName}" supplied to "${componentName}", only valid on numbered lists`,
      )
    }
    if (
      props.variant === 'numbered' &&
      prop !== undefined &&
      typeof prop !== 'string'
    ) {
      error = new Error(
        `Invalid prop "${propName}" of value "${prop} supplied to "${componentName}", expected string.`,
      )
    }
    return error
  },
}

List.defaultProps = {
  className: '',
  variant: 'bullet',
  start: undefined,
}

const ListItem = forwardRef(function ListItem({ children, ...props }, ref) {
  return (
    <li {...props} ref={ref}>
      {children}
    </li>
  )
})

ListItem.displayName = 'eds-listitem'

ListItem.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

ListItem.defaultProps = {
  className: null,
}

List.ListItem = ListItem

export { List }
