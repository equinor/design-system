import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Button } from '../Button'
import { Icon } from '../Icon'
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
`

const UnorderedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: ${tokens.spacingSmall};
  grid-auto-flow: column;
`

const StyledButton = styled(Button)`
  display: inline-grid;
`

const ListItem = styled.li`
  display: inline-grid;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  justify-self: center;
  fill: ${tokens.disabledColor};
`

function getAriaLabel(page, selected) {
  return `${selected ? 'Current page, ' : 'Go to '}page ${page}`
}

// function paginationControl(totalItems) {
//   let itemList = []
//   for (let i = 1; i <= totalItems; i++) {
//     itemList.push({
//       page: i,
//       selected: false,
//     })
//   }

//   return itemList
// }

export const Pagination = forwardRef(function Pagination(
  { totalItems, showTotalItems, itemsPerPage, switcher, className, ...other },
  ref,
) {
  const pages = Math.ceil(totalItems / itemsPerPage) // Total page numbers
  const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >

  const [activePage, setActivePage] = useState(1)

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

  //console.log('items', items, items.length)

  return (
    <Navigation aria-label="pagination" {...props}>
      {switcher && (
        <select>
          <option>option 1</option>
          <option>option 2</option>
        </select>
      )}
      <UnorderedList
        style={{
          gridTemplateColumns: 'repeat(' + columns + ', 48px)',
        }}
      >
        <StyledButton
          variant="ghost_icon"
          onClick={moveLeft}
          disabled={activePage === 1}
        >
          <Icon name="chevron_left" title="previous" />
        </StyledButton>
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
        <StyledButton
          variant="ghost_icon"
          onClick={moveRight}
          disabled={activePage === items.length + 1}
        >
          <Icon name="chevron_right" title="next" />
        </StyledButton>
      </UnorderedList>
    </Navigation>
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
