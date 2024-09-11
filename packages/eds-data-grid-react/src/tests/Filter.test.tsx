import { fireEvent, render, screen, within } from '@testing-library/react'
import {
  createTable,
  getCoreRowModel,
  getFacetedMinMaxValues,
  Table,
} from '@tanstack/react-table'
import { data, Data } from './data'
import { columns } from './columns'
import { userEvent } from '@testing-library/user-event'
import { FilterWrapper } from '../components/FilterWrapper'
import { TableProvider } from '../EdsDataGridContext'

const openPopover = (header: HTMLElement) => {
  const button = within(header).getByTestId('open-filters')
  fireEvent(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
}

describe('Filter', () => {
  let table: Table<Data>
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

    filterChangeSpy = jest.fn(() => null)
    table = createTable({
      getCoreRowModel: getCoreRowModel(),
      data,
      onStateChange: () => null,
      columns,
      state: {},
      renderFallbackValue: () => '',
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onColumnFiltersChange: filterChangeSpy,
    })
  })
  describe('Render', () => {
    it('should render', () => {
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('cargoId')} />
        </TableProvider>,
      )
      expect(baseElement).toBeTruthy()
    })
    it('should have 1 input for text-columns', () => {
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('status')} />
        </TableProvider>,
      )
      openPopover(baseElement)
      expect(within(baseElement).getAllByRole('combobox').length).toBe(1)
    })
    it('should have 2 inputs for number-columns', () => {
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('numeric')} />
        </TableProvider>,
      )
      openPopover(baseElement)
      expect(screen.queryAllByRole('spinbutton').length).toBe(2)
    })
  })

  describe('onChange', () => {
    it('should emit changes on input', async () => {
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('status')} />
        </TableProvider>,
      )
      openPopover(baseElement)
      const input = within(baseElement).getByRole('combobox')
      const col = table.getColumn('status')
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
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('status')} />
        </TableProvider>,
      )
      openPopover(baseElement)
      const input = within(baseElement).getByRole('combobox')
      const col = table.getColumn('status')
      const spy = jest.spyOn(col, 'setFilterValue')
      fireEvent.change(input, { target: { value: '1234' } })
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith('1234')
        expect(filterChangeSpy).toHaveBeenCalled()
      }, 500)
    })

    it('should emit changes on change-event (numeric)', () => {
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={table.getColumn('numeric')} />
        </TableProvider>,
      )
      openPopover(baseElement)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const inputs = within(baseElement).getAllByRole(
        'spinbutton',
      ) as Array<HTMLInputElement>
      const col = table.getColumn('numeric')
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
      const col = table.getColumn('numeric')
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={col} />
        </TableProvider>,
      )

      openPopover(baseElement)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const inputs = within(baseElement).getAllByRole(
        'spinbutton',
      ) as Array<HTMLInputElement>
      const min = inputs[0]
      const max = inputs[1]
      expect(min.placeholder).toBe(`0`)
      expect(max.placeholder).toBe(`0`)
    })

    it('should work with min/max if no faceted values', () => {
      table = createTable({
        getCoreRowModel: getCoreRowModel(),
        data,
        onStateChange: () => null,
        columns: columns,
        state: {},
        renderFallbackValue: () => '',
      })
      const col = table.getColumn('numeric')
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={col} />
        </TableProvider>,
      )
      openPopover(baseElement)
      // eslint complains about unnecessary cast, but HTMLElement != HTMLInputElement
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const inputs = within(baseElement).getAllByRole(
        'spinbutton',
      ) as Array<HTMLInputElement>
      const min = inputs[0]
      const max = inputs[1]
      expect(min.placeholder).toBe(`0`)
      expect(max.placeholder).toBe(`0`)
    })

    it('should work with custom filters', () => {
      const col = table.getColumn('status')
      const CustomFilter = ({
        onChange,
        value,
      }: {
        onChange: (value: string) => void
        value: string
      }) => (
        <input
          data-testid={'input'}
          placeholder={'Custom filter'}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      )
      const { baseElement } = render(
        <TableProvider
          enableSorting={false}
          stickyHeader={true}
          stickyFooter={false}
          enableColumnFiltering={true}
          table={table}
        >
          <FilterWrapper column={col} CustomComponent={CustomFilter} />
        </TableProvider>,
      )
      openPopover(baseElement)
      // eslint complains about unneccessary cast, but HTMLElement != HTMLInputElement
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = within(baseElement).getByTestId('input') as HTMLInputElement
      expect(input).toBeDefined()
      expect(input.placeholder).toBe('Custom filter')
    })
  })
})
