/* istanbul ignore file */
import { Column } from '@tanstack/react-table'
import { FC, MouseEvent, useCallback, useRef, useState } from 'react'
import { Button, Icon, Popover } from '@equinor/eds-core-react'
import { filter_alt, filter_alt_active } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { Filter } from './Filter'
import { useTableContext } from '../EdsDataGridContext'
import { FilterVisibility } from './TableCell'

type FilterProps<T = unknown, U = unknown> = {
  column: Column<T>
  CustomComponent?: FC<{
    onChange: (value: U) => void
    value: U
  }>
}

export function FilterWrapper<T = unknown>({
  column,
  CustomComponent,
}: FilterProps<T>) {
  const { table } = useTableContext()
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)
  const [open, setOpen] = useState(false)
  const filterIconRef = useRef<HTMLButtonElement | null>(undefined)

  const togglePopover = (event: MouseEvent) => {
    event.stopPropagation()
    setOpen(!open)
  }

  const columnFilterValue = column.getFilterValue() as T | Array<T>

  const hasActiveFilters = (value: T | Array<T>) => {
    if (Array.isArray(value)) {
      if (typeof firstValue === 'number') {
        return (value as Array<number>).some((v) => !isNaN(v) && !!v)
      } else {
        return value.filter((v) => !!v).length > 0
      }
    }
    return value
  }

  const onChange = useCallback(
    (value: unknown) => column.setFilterValue(value),
    [column],
  )

  return (
    <FilterVisibility onClick={(e) => e.stopPropagation()}>
      <Button
        aria-haspopup
        aria-expanded={open}
        data-testid={'open-filters'}
        ref={filterIconRef}
        onClick={togglePopover}
        variant={'ghost_icon'}
        aria-label={'Show column filters'}
      >
        <Icon
          color={tokens.colors.text.static_icons__default.hex}
          data={
            hasActiveFilters(columnFilterValue) ? filter_alt_active : filter_alt
          }
        />
      </Button>
      <Popover
        style={{ width: typeof firstValue === 'number' ? '220px' : '340px' }}
        anchorEl={filterIconRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Popover.Content
          style={{ width: typeof firstValue === 'number' ? '180px' : '310px' }}
        >
          {CustomComponent ? (
            <CustomComponent onChange={onChange} value={columnFilterValue} />
          ) : (
            <Filter column={column} table={table} />
          )}
        </Popover.Content>
      </Popover>
    </FilterVisibility>
  )
}
