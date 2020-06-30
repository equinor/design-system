import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { PaginationItem } from './PaginationItem'
import { pagination as tokens } from './Pagination.tokens'
import { chevron_left, chevron_right } from '@equinor/eds-icons'
import { gridColumnsTemplate } from '../_common/templates'

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
    /* ${gridColumnsTemplate(((columns) => columns, 48px))} */
  /* ${({ columns }) =>
    css`
      grid-template-columns: repeat(${columns}, 48px);
      margin: ${columns};
    `} */
grid-template-columns: repeat(7, 48px);
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

function paginationControl(pages) {
  let itemList = []
  for (let i = 1; i <= pages; i++) {
    itemList.push({
      page: i,
      selected: false,
    })
  }

  return itemList
}

export const Pagination = forwardRef(function Pagination(
  { pages, total, switcher, className, ...other },
  ref,
) {
  const columns = pages < 5 ? pages + 2 : 7
  const gridTemplate = `repeat(${columns}, 48px)`

  console.log(columns)
  const props = {
    ref,
    pages,
    total,
    switcher,
    gridTemplate,
    columns,
    className,
    ...other,
  }
  const items = paginationControl(pages)
  //const items = paginationControl(...props)

  return (
    <Navigation aria-label="pagination" {...props}>
      {switcher && (
        <select>
          <option>option 1</option>
          <option>option 2</option>
        </select>
      )}
      <UnorderedList>
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
  // Number of pages
  pages: PropTypes.number.isRequired,
  // Shows total item count
  total: PropTypes.bool,
  // Dropdown menu to select amount of items per page
  switcher: PropTypes.bool,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Pagination.defaultProps = {
  className: '',
  children: undefined,
  total: false,
  switcher: false,
}
