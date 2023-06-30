/* istanbul ignore file */
import { Column, Table as TanStackTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DebouncedInput } from './DebouncedInput'

type FilterProps<T = unknown> = {
  column: Column<T>
  table: TanStackTable<T>
}

export function Filter<T = unknown>({ column, table }: FilterProps<T>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo<Array<string>>(
    () =>
      typeof firstValue === 'number'
        ? ([] as Array<never>)
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .map((v: string) => v ?? 'NULL_OR_UNDEFINED'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  )

  return typeof firstValue === 'number' ? (
    <div>
      <DebouncedInput
        type="number"
        values={sortedUniqueValues}
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
        }`}
      />
      <DebouncedInput
        type="number"
        values={sortedUniqueValues}
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
        }`}
      />
    </div>
  ) : (
    <DebouncedInput
      type="text"
      values={sortedUniqueValues}
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search (${column.getFacetedUniqueValues().size})`}
      list={column.id + 'list'}
    />
  )
}
