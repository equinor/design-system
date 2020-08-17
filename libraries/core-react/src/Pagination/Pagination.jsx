import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { PaginationItem } from './PaginationItem'
import { pagination as tokens } from './Pagination.tokens'
import {
  chevron_left,
  chevron_right,
  more_horizontal,
} from '@equinor/eds-icons'
import { PaginationControl } from './paginationControl'

const icons = {
  chevron_left,
  chevron_right,
  more_horizontal,
}

Icon.add(icons)

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  margin-left: ${({ withItemIndicator }) =>
    withItemIndicator ? tokens.spacingSmall : 0};
`

const OrderedList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: ${tokens.spacingSmall};
  grid-auto-flow: column;
`

const ListItem = styled.li`
  display: inline-grid;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  justify-self: center;
  fill: ${tokens.disabledColor};
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
`

const Text = styled(Typography)`
  white-space: nowrap;
`

function getAriaLabel(page, selected) {
  return `${selected === page ? 'Current page, ' : 'Go to '}page ${page}`
}

export const Pagination = forwardRef(function Pagination(
  {
    totalItems,
    defaultPage,
    withItemIndicator,
    itemsPerPage,
    className,
    ...other
  },
  ref,
) {
  const pages = Math.ceil(totalItems / itemsPerPage) // Total page numbers
  const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >

  const [activePage, setActivePage] = useState(defaultPage)

  const currentItemFirst =
    activePage === 1 ? 1 : activePage * itemsPerPage - itemsPerPage + 1 // First number of range of items at current page
  const currentItemLast =
    activePage === pages ? totalItems : activePage * itemsPerPage // Last number of range of items at current page

  const handleClick = (page) => () => {
    setActivePage(page)
  }

  const moveLeft = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1)
    }
  }

  const moveRight = () => {
    if (activePage < pages) {
      setActivePage(activePage + 1)
    }
  }

  const items = PaginationControl(pages, activePage)

  const props = {
    ref,
    withItemIndicator,
    className,
    ...other,
  }

  const pagination = (
    <Navigation aria-label="pagination" {...props}>
      <OrderedList
        style={{
          gridTemplateColumns: 'repeat(' + columns + ', 48px)',
        }}
      >
        <ListItem>
          <Button
            variant="ghost_icon"
            onClick={moveLeft}
            disabled={activePage === 1}
            aria-label="Go to previous page"
          >
            <Icon name="chevron_left" title="previous" />
          </Button>
        </ListItem>

        {items.length > 0 &&
          items.map((page, index) =>
            page !== 'ELLIPSIS' ? (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={'list-item' + index}>
                <PaginationItem
                  {...page}
                  aria-label={getAriaLabel(page, activePage)}
                  aria-current={activePage}
                  page={page}
                  selected={page === activePage}
                  onClick={handleClick(page)}
                />
              </ListItem>
            ) : (
              <ListItem>
                <StyledIcon
                  // eslint-disable-next-line react/no-array-index-key
                  key={'ellipsis-' + index}
                  name="more_horizontal"
                  title="ellipsis"
                />
              </ListItem>
            ),
          )}
        <ListItem>
          <Button
            variant="ghost_icon"
            onClick={moveRight}
            aria-label="Go to next page"
            disabled={activePage === pages}
          >
            <Icon name="chevron_right" title="next" />
          </Button>
        </ListItem>
      </OrderedList>
    </Navigation>
  )

  return withItemIndicator ? (
    <FlexContainer>
      <Text>
        {currentItemFirst !== currentItemLast
          ? currentItemFirst +
            ' - ' +
            currentItemLast +
            ' of ' +
            totalItems +
            ' items'
          : currentItemFirst + ' of ' + totalItems + ' items'}
      </Text>
      {pagination}
    </FlexContainer>
  ) : (
    pagination
  )
})

Pagination.displayName = 'eds-pagination'

Pagination.propTypes = {
  // Number of total items to be paginated
  totalItems: PropTypes.number.isRequired,
  // To display total item count
  withItemIndicator: PropTypes.bool,
  // Choose number of items per page
  itemsPerPage: PropTypes.number,
  // Callback fired on page change
  onChange: PropTypes.func,
  // Default start page
  defaultPage: PropTypes.number,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Pagination.defaultProps = {
  className: '',
  defaultPage: 1,
  children: undefined,
  withItemIndicator: false,
  itemsPerPage: 10,
  onChange: () => {},
}
