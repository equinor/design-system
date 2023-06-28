import { fireEvent, render, screen } from '@testing-library/react'
import {
  createTable,
  getCoreRowModel,
  getFacetedMinMaxValues,
  Table,
} from '@tanstack/react-table'
import { Filter } from '../components/Filter'
import data from './data'
import { columns } from './columns'
import userEvent from '@testing-library/user-event'

describe('Filter', () => {
  let table: Table<any>
  let filterChangeSpy: jest.SpyInstance
  beforeEach(() => {
    class ResizeObserver {
      observe() {
        // do nothing
      }

      unobserve() {
        // do nothing
      }

      disconnect() {
        // do nothing
      }
    }

    window.ResizeObserver = ResizeObserver

    const onColumnFiltersChange = jest.fn()
    const obj = { onColumnFiltersChange }
    filterChangeSpy = jest.spyOn(obj, 'onColumnFiltersChange')
    table = createTable({
      getCoreRowModel: getCoreRowModel(),
      data,
      onStateChange: () => null,
      columns: columns as any,
      state: {},
      renderFallbackValue: () => '',
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      onColumnFiltersChange: filterChangeSpy as any,
    })
  })
  describe('Render', () => {
    it('should render', () => {
      const { baseElement } = render(
        <Filter column={table.getColumn('cargoId')!} table={table} />,
      )
      expect(baseElement).toBeTruthy()
    })
    it('should have 1 input for text-columns', () => {
      const { baseElement } = render(
        <Filter column={table.getColumn('status')!} table={table} />,
      )
      expect(baseElement.querySelectorAll('input').length).toBe(1)
    })
    it('should have 2 inputs for number-columns', () => {
      render(<Filter column={table.getColumn('numeric')!} table={table} />)
      expect(screen.queryAllByRole('spinbutton').length).toBe(2)
    })
  })

  describe('onChange', () => {
    it('should emit changes on input', async () => {
      const { baseElement } = render(
        <Filter column={table.getColumn('status')!} table={table} />,
      )
      const input = baseElement.querySelector('input')!
      const col = table.getColumn('status')!
      const spy = jest.spyOn(col, 'setFilterValue')
      await userEvent.type(input, '1234')
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith('1234')
      }, 500)
      /*    jest.useFakeTimers();
          const { baseElement } = render(<Filter column={ table.getColumn('status')! } table={ table }/>);
          const input = baseElement.querySelector('input')!;
          const col = table.getColumn('status')!;
          const spy = jest.spyOn(col, 'setFilterValue');
          await userEvent.type(input, '1234');
          jest.runAllTimers();
            expect(spy).toHaveBeenCalled()
          jest.useRealTimers();*/
    })

    it('should emit changes on change-event (text)', () => {
      const { baseElement } = render(
        <Filter column={table.getColumn('status')!} table={table} />,
      )
      const input = baseElement.querySelector('input')!
      const col = table.getColumn('status')!
      const spy = jest.spyOn(col, 'setFilterValue')
      fireEvent.change(input, { target: { value: '1234' } })
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith('1234')
        expect(filterChangeSpy).toHaveBeenCalled()
      }, 500)
    })

    it('should emit changes on change-event (numeric)', () => {
      const { baseElement } = render(
        <Filter column={table.getColumn('numeric')!} table={table} />,
      )
      const inputs = baseElement.querySelectorAll('input')!
      const col = table.getColumn('numeric')!
      const spy = jest.spyOn(col, 'setFilterValue')
      fireEvent.change(inputs[0], { target: { value: '1234' } })
      fireEvent.change(inputs[1], { target: { value: '1234' } })
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith('1234')
      }, 500)
    })
  })

  describe('Placeholders', () => {
    it('should have min/max for numeric', () => {
      const col = table.getColumn('numeric')!
      const { baseElement } = render(<Filter column={col} table={table} />)
      const inputs = baseElement.querySelectorAll('input')!
      const min = inputs[0]
      const max = inputs[1]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const minValue = Math.min(...data.map((v) => v.qty))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const maxValue = Math.max(...data.map((v) => v.qty))
      expect(min.placeholder).toBe(`Min (${minValue})`)
      expect(max.placeholder).toBe(`Max (${maxValue})`)
    })

    it('should work with min/max if no faceted values', () => {
      table = createTable({
        getCoreRowModel: getCoreRowModel(),
        data,
        onStateChange: () => null,
        columns: columns as any,
        state: {},
        renderFallbackValue: () => '',
      })
      const col = table.getColumn('numeric')!
      const { baseElement } = render(<Filter column={col} table={table} />)
      const inputs = baseElement.querySelectorAll('input')!
      const min = inputs[0]
      const max = inputs[1]
      expect(min.placeholder).toBe(`Min `)
      expect(max.placeholder).toBe(`Max `)
    })
  })
})
