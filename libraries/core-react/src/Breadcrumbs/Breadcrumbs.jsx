import React, { forwardRef, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'
import { Typography } from '../Typography'

const OrderedList = styled.ol`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  li:not(:last-child)::after {
    content: '/';
    position: absolute;
    top: 2px;
    right: 0;
    color: ${tokens.colors.enabled};
  }

  li:not(:last-child) {
    padding-right: 21px;
    position: relative;
  }

  li:not(:first-child) {
    padding-left: ${tokens.margin};
  }
`

const ListItem = styled.li`
  display: inline-block;
`

const Separator = styled(Typography)`
  color: ${tokens.colors.enabled};
  margin: 0 ${tokens.margin};
`

const Collapsed = styled(Typography)`
  &:hover {
    text-decoration: underline;
    color: ${tokens.colors.hover};
  }
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus {
    outline: ${tokens.outline};
    outline-offset: 6px;
  }
  color: ${tokens.colors.enabled};
  text-decoration: none;
`

export const Breadcrumbs = forwardRef(function Breadcrumbs(
  { className, children, collapse, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  const [expanded, setExpanded] = useState(false)

  const collapsedCrumbs = (allCrumbs) => {
    const handleExpandClick = () => {
      setExpanded(true)
    }

    if (allCrumbs.length < 3) {
      return allCrumbs
    }

    return [
      allCrumbs[0],
      <Fragment key="collapsed">
        <ListItem>
          <Collapsed
            link
            role="button"
            variant="body_short"
            onClick={handleExpandClick}
            tabIndex={0}
          >
            …
          </Collapsed>
        </ListItem>
      </Fragment>,
      allCrumbs[allCrumbs.length - 1],
    ]
  }

  const allCrumbs = React.Children.toArray(children).map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={`breadcrumb-${index}`}>
      <ListItem>{child}</ListItem>
    </Fragment>
  ))

  return (
    <nav {...props} aria-label="breadcrumbs" role="breadcrumbs">
      <OrderedList>
        {collapse && !expanded ? collapsedCrumbs(allCrumbs) : allCrumbs}
      </OrderedList>
    </nav>
  )
})

Breadcrumbs.displayName = 'eds-breadcrumbs'

Breadcrumbs.propTypes = {
  /*
   * Collapses the list of breadcrumbs so that only the first
   * and last breadcrumb will be shown, with an ellipsis in between.
   */
  collapse: PropTypes.bool,
  // Breadcrumbs children
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumbs.defaultProps = {
  className: '',
  collapse: false,
}
