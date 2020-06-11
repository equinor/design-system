import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'
import { Typography } from '../Typography'

const OrderedList = styled.ol`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  /* flex-wrap: ${(expanded) => (expanded ? 'wrap' : 'nowrap')}; */
`

const ListItem = styled.li`
  display: inline-block;
`

const Separator = styled.li`
  color: ${tokens.colors.enabled};
  margin: 0 ${tokens.margin};
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

  const [collapsed, setCollapsed] = React.useState(collapse)

  const allBreadcrumbs = React.Children.toArray(children).map(
    (child, index) => (
      <>
        {/* eslint-disable-next-line react/no-array-index-key*/}
        <ListItem key={`child-${index}`}>{child}</ListItem>
        {index !== React.Children.toArray(children).length - 1 && (
          <Separator key={`separator-${index}`} aria-hidden>
            <Typography variant="body_short">/</Typography>
          </Separator>
        )}
      </>
    ),
  )

  return (
    <nav {...props} aria-label="breadcrumbs" role="breadcrumbs">
      <OrderedList>{allBreadcrumbs}</OrderedList>
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
