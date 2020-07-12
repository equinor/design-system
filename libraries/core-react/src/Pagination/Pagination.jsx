import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { PaginationItem } from './PaginationItem'
import { pagination as tokens } from './Pagination.tokens'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import { PaginationControl } from './paginationControl'

const icons = {
  chevron_left,
  chevron_right,
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
  const siblings = 4 // neighboring items on both sides of current page ( 2*2 = 4)

  const goToPage = (page) => {
    const { onPageChange = (f) => f } = this.props
    const activePage = Math.max(0, Math.min(page, pages))

    const pageData = {
      activePage,
      totalPages: pages,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
    }

    setActivePage({ activePage }, () => onPageChange(pageData))
  }

  const handleClick = (page) => (e) => {
    e.preventDefault()
    goToPage(page)
  }

  const moveLeft = (e) => {
    e.preventDefault()
    goToPage(activePage - siblings * 2 - 1)
  }

  const moveRight = (e) => {
    e.preventDefault()
    goToPage(activePage + siblings * 2 + 1)
  }

  //let items = []
  const { items } = PaginationControl({ ...props })

  const props = {
    ref,
    totalItems,
    showTotalItems,
    switcher,
    columns,
    className,
    ...other,
  }

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
        <StyledButton variant="ghost_icon" onClick={moveLeft}>
          <Icon name="chevron_left" title="previous" />
        </StyledButton>
        {items.length > 0 &&
          items.map((page, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={index}>
              <PaginationItem
                {...page}
                aria-label={getAriaLabel(page.page, page.selected)}
                aria-current={page.selected}
                page={page.page}
                selected={page.selected}
                onClick={handleClick}
              />
            </ListItem>
          ))}
        <StyledButton variant="ghost_icon" onClick={moveRight}>
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
