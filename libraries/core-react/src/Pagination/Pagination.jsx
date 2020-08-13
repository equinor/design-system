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
  margin-left: ${({ showTotalItems }) =>
    showTotalItems ? tokens.spacingSmall : 0};
`

const UnorderedList = styled.ul`
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
` // TODO: Design says #000000 but looks better with default color (almost black)

function getAriaLabel(page, selected) {
  return `${selected ? 'Current page, ' : 'Go to '}page ${page}`
}

export const Pagination = forwardRef(function Pagination(
  { totalItems, showTotalItems, itemsPerPage, switcher, className, ...other },
  ref,
) {
  const pages = Math.ceil(totalItems / itemsPerPage) // Total page numbers
  const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >

  const [activePage, setActivePage] = useState(1)

  const currentItemNumsFirst =
    activePage === 1 ? 1 : activePage * itemsPerPage - itemsPerPage + 1
  const currentItemNumsLast =
    activePage === pages ? totalItems : activePage * itemsPerPage

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
    totalItems,
    showTotalItems,
    switcher,
    columns,
    className,
    ...other,
  }

  const pagination = (
    <Navigation aria-label="pagination" {...props}>
      <UnorderedList
        style={{
          gridTemplateColumns: 'repeat(' + columns + ', 48px)',
        }}
      >
        <Button
          variant="ghost_icon"
          onClick={moveLeft}
          disabled={activePage === 1}
          aria-label={activePage !== 1 && 'Go to previous page'}
        >
          <Icon name="chevron_left" title="previous" />
        </Button>
        {items.length > 0 &&
          items.map((page, index) =>
            page !== 'ELLIPSIS' ? (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={index}>
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
              <StyledIcon name="more_horizontal" title="ellipsis" />
            ),
          )}
        <Button
          variant="ghost_icon"
          onClick={moveRight}
          aria-label={activePage !== pages && 'Go to next page'}
          disabled={activePage === pages}
        >
          <Icon name="chevron_right" title="next" />
        </Button>
      </UnorderedList>
    </Navigation>
  )

  // TODO: Dropdown component will be added when that component is ready
  return showTotalItems ? (
    <FlexContainer>
      <Text>
        {currentItemNumsFirst +
          ' - ' +
          currentItemNumsLast +
          ' of ' +
          totalItems +
          ' items'}
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
  // Display total item count
  showTotalItems: PropTypes.bool,
  // Choose number of items per page
  itemsPerPage: PropTypes.number,
  // Display dropdown menu for user to choose items per page
  switcher: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Pagination.defaultProps = {
  className: '',
  children: undefined,
  showTotalItems: false,
  switcher: false,
  itemsPerPage: 20,
}
