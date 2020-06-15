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
`

const ListItem = styled.li`
  display: inline-block;
`

const Separator = styled.li`
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
    const handleExpandClick = (e) => {
      setExpanded(true)

      // Move focus from ... to component after expanding
      // const focusable = e.currentTarget.parentNode.querySelector('')
      // if(focusable) {
      //   focusable.focus()
      // }
    }

    if (allCrumbs.length <= 2) {
      return allCrumbs
    }

    return [
      allCrumbs[0],
      <Fragment key="collapsed">
        <Collapsed
          link
          variant="body_short"
          onClick={handleExpandClick}
          tabIndex={0}
        >
          ...
        </Collapsed>
        <Separator aria-hidden>
          <Typography variant="body_short">/</Typography>
        </Separator>
      </Fragment>,
      allCrumbs[allCrumbs.length - 1],
    ]
  }

  const allCrumbs = React.Children.toArray(children).map((child, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Fragment key={`breadcrumb-${index}`}>
      <ListItem>{child}</ListItem>
      {index !== React.Children.toArray(children).length - 1 && (
        <Separator aria-hidden>
          <Typography variant="body_short">/</Typography>
        </Separator>
      )}
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
   * Maximum breadcrumb items to display between first and last item before collapse
   * Only the first and last breadcrumb will be shown, with an ellipsis in between.
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
