import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { PaginationItem } from './PaginationItem'
import { pagination as tokens } from './Pagination.tokens'
import { chevron_left, chevron_right } from '@equinor/eds-icons'

//import { paginationControl } from './paginationControl'

const icons = {
  chevron_left,
  chevron_right,
}

Icon.add(icons)

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

const UnorderedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: ${tokens.spacingSmall};
  grid-auto-flow: row;
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

function paginationControl(totalItems) {
  let itemList = []
  for (let i = 1; i <= totalItems; i++) {
    itemList.push({
      page: i,
      selected: false,
    })
  }

  return itemList
}

export const Pagination = forwardRef(function Pagination(
  { totalItems, showTotalItems, switcher, className, onChange, ...other },
  ref,
) {
  const columns = totalItems < 5 ? totalItems + 2 : 7

  const props = {
    ref,
    totalItems,
    showTotalItems,
    switcher,
    columns,
    onChange,
    className,
    ...other,
  }
  const items = paginationControl(totalItems)
  //const items = paginationControl(...props)
  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(1, totalItems))
  const endPages = range(Math.max(totalItems - 1 + 1, 1 + 1), totalItems)
  console.log(startPages, endPages)
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
        <StyledButton variant="ghost_icon">
          <Icon name="chevron_left" title="previous" />
        </StyledButton>
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={index}>
            <PaginationItem
              {...item}
              aria-label={getAriaLabel(item.page, item.selected)}
              aria-current={item.selected}
              page={item.page}
              selected={item.selected}
            />
          </ListItem>
        ))}
        <StyledButton variant="ghost_icon">
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
  // Callback fired when page is changed
  onChange: PropTypes.func,
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
  onChange: () => {},
  itemsPerPage: 20,
}
