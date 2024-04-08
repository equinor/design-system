/* istanbul ignore file */
import { Column, Table as TanStackTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DebouncedInput } from './DebouncedInput'
import styled from 'styled-components'

type FilterProps<T = unknown> = {
  column: Column<T>
  table: TanStackTable<T>
}

const NumberContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 80px;
  grid-column-gap: 32px;
`

export function Filter<T = unknown>({ column, table }: FilterProps<T>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnText = useMemo<string | undefined>(() => {
    let header: string | undefined
    try {
      if (typeof column.columnDef.header === 'function') {
        const obj: React.ReactElement<{ children: string }> =
          column.columnDef.header(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument
            {} as any,
          ) as React.ReactElement<{
            children: string
          }>
        header = obj.props.children
      } else {
        header = column.columnDef.header
      }
    } catch {
      /*em all*/
    }
    return header
  }, [column.columnDef])

  const columnFilterValue = column.getFilterValue() as T | Array<T>

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
    <NumberContainer>
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
    </NumberContainer>
  ) : (
    <DebouncedInput
      type="text"
      label={columnText}
      values={sortedUniqueValues}
      debounce={100}
      value={(columnFilterValue ?? []) as Array<string>}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`${
        ((columnFilterValue ?? []) as Array<string>).length
      } / ${column.getFacetedUniqueValues().size} selected`}
      list={column.id + 'list'}
    />
  )
}
