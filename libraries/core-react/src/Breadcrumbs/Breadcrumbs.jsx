import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

const OrderedList = styled.ol`
  list-style: none;
  display: flex;
  /* flex-wrap: ${(expanded) => (expanded ? 'wrap' : 'nowrap')}; */
`

export const Breadcrumbs = forwardRef(function Breadcrumbs(
  { className, children, collapse, expanded, maxLabelWidth, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  const allItems = React.Children.toArray(children).map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <li key={`child-${index}`}>{child}</li>
  ))

  return (
    <nav {...props} aria-label="breadcrumbs" role="breadcrumbs">
      <OrderedList>{allItems}</OrderedList>
    </nav>
  )
})

Breadcrumbs.displayName = 'eds-breadcrumbs'

Breadcrumbs.propTypes = {
  /*
   * Only the first and last breadcrumb
   * will be shown, with an ellipsis in between.
   */
  collapse: PropTypes.bool,
  /*
   * Max label width in pixels,
   * truncate long labels based on this width
   */
  maxLabelWidth: PropTypes.number,
  /**
   * Expanded breadcrumbs can wrap to two or more lines
   */
  expanded: PropTypes.bool,
  // Breadcrumbs children
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumbs.defaultProps = {
  className: '',
  maxLabelWidth: undefined,
  collapse: false,
  expanded: false,
}
