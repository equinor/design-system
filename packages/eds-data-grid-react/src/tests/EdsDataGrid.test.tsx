import { fireEvent, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { EdsDataGrid } from '../EdsDataGrid'
import { columns } from './columns'
import { Data, data } from './data'

function generateLargeDataset(multiplier: number): Array<Data> {
  return Array(multiplier).fill(data).flat() as Array<Data>
}

function getMaxUpdateErrors(
  consoleError: jest.MockedFunction<typeof console.error>,
) {
  return consoleError.mock.calls.filter((call: unknown[]) =>
    call.some(
      (arg: unknown) =>
        typeof arg === 'string' &&
        arg.includes('Maximum update depth exceeded'),
    ),
  )
}

describe('EdsDataGrid', () => {
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

    //https://github.com/TanStack/virtual/issues/641
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 120,
        height: 120,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
    })

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 500,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 2000,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 500,
    })
  })

  describe('Filtering', () => {
    it('should have built-in filtering if enabled', async () => {
      render(
        <EdsDataGrid
          enableColumnFiltering={true}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getAllByRole('columnheader').length).toBe(columns.length)
      expect(
        within(screen.getAllByRole('columnheader')[0]).getByTestId(
          'open-filters',
        ),
      ).toBeTruthy()

      const header = screen.getAllByRole('columnheader')[0]
      const button = within(header).getByTestId('open-filters')
      fireEvent(
        button,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )

      expect(
        within(screen.getAllByRole('listbox')[0]).queryAllByRole('option')
          .length,
      ).toBe(0)

      await userEvent.click(
        within(screen.getAllByRole('columnheader')[0]).getByRole('combobox'),
      )
      expect(
        within(screen.getAllByRole('listbox')[0]).queryAllByRole('option')
          .length,
      ).toBe(data.length)
    })

    // Something weird about this test. It passes if ran alone with `it.only` or only Filtering block, but fails when all tests are ran...
    // In addition, I'm unable to get jest.useFakeTimers() to work, so it only passes with setTimeout
    it.skip('should apply filter on input change', async () => {
      render(
        <EdsDataGrid
          enableColumnFiltering={true}
          columns={columns}
          rows={data}
        />,
      )
      const col = screen.getAllByRole('columnheader')[0]
      const length = screen.getAllByRole('row').length
      const box = within(col).getByRole('combobox')

      await userEvent.type(box, '1')

      setTimeout(() => {
        expect(screen.getAllByRole('row').length).toBeLessThan(length)
      }, 600)
    })
  })
  describe('Render', () => {
    it('should render successfully', () => {
      const { baseElement } = render(
        <EdsDataGrid columns={columns} rows={data} />,
      )
      expect(baseElement).toBeTruthy()
    })

    it(`should render with ${columns.length} columns`, () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(screen.getAllByRole('columnheader').length).toBe(columns.length)
    })

    it(`should render with ${data.length} rows + 1 header row`, () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(screen.getAllByRole('row').length).toBe(data.length + 1)
    })

    it('should render with caption element', () => {
      render(
        <EdsDataGrid
          caption={<h1>My Caption</h1>}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getByText('My Caption')).toBeTruthy()
    })

    it('should render sticky header', () => {
      render(<EdsDataGrid stickyHeader={true} columns={columns} rows={data} />)
      expect(
        screen.getByRole('table').classList.contains('sticky-header'),
      ).toBeTruthy()
      screen.getAllByRole('columnheader').forEach((column) => {
        expect(window.getComputedStyle(column).position).toBe('sticky')
      })
    })

    /**
     * Footer
     */
    it('should not render footer by default when enableFooter is not provided', () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      const foot = screen.queryByTestId('eds-grid-footer')
      expect(foot).toBeNull() // Assert Footer is not available in the document
    })

    it('should render footer when `enableFooter` is provided', () => {
      render(<EdsDataGrid columns={columns} rows={data} enableFooter />)
      const foot = screen.getByTestId('eds-grid-footer')
      expect(foot).toBeTruthy() // Assert Footer is not available in the document
      const thElements = within(foot).getAllByRole('columnheader')
      thElements.forEach((th) => {
        expect(window.getComputedStyle(th).position).not.toBe('sticky')
      })
    })

    it('should render sticky footer when `enableFooter` & `stickyFooter` provided', () => {
      render(
        <EdsDataGrid columns={columns} rows={data} enableFooter stickyFooter />,
      )
      const foot = screen.getByTestId('eds-grid-footer')
      expect(foot).toBeTruthy() // Assert Footer is not available in the document
      const thElements = within(foot).getAllByRole('columnheader')
      thElements.forEach((th) => {
        expect(window.getComputedStyle(th).position).toBe('sticky')
      })
    })
  })

  describe('Sorting', () => {
    it('should have built-in sorting if enabled', async () => {
      // Setup
      render(<EdsDataGrid enableSorting={true} columns={columns} rows={data} />)
      const header = screen.getAllByRole('columnheader')[0]
      const sortButton = within(header).getByTestId('sort-button-cargoId')

      // Initial state verification
      expect(header.getAttribute('aria-sort')).toBe('none')

      // Test ascending sort
      await userEvent.click(sortButton)
      expect(header.getAttribute('aria-sort')).toBe('ascending')

      // Test descending sort
      await userEvent.click(sortButton)
      expect(header.getAttribute('aria-sort')).toBe('descending')

      // Test reset to default (optional additional verification)
      await userEvent.click(sortButton)
      expect(header.getAttribute('aria-sort')).toBe('none')
    })

    it('should not have sorting if not set', async () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(
        screen.getAllByRole('columnheader')[0].getAttribute('aria-sort'),
      ).toBe('none')
      await userEvent.click(screen.getAllByRole('columnheader')[0])
      expect(
        screen.getAllByRole('columnheader')[0].getAttribute('aria-sort'),
      ).toBe('none')
    })
  })

  describe('should show fallback text if defined', () => {
    it('should only show placeholder message if no rows and emptyMessage is defined', () => {
      const emptyMessage = 'No data to display'
      render(
        <EdsDataGrid emptyMessage={emptyMessage} columns={columns} rows={[]} />,
      )
      expect(screen.getByText(emptyMessage)).toBeTruthy()
    })
    it('should not show placeholder message if rows.length > 0 and emptyMessage is defined', () => {
      const emptyMessage = 'No data to display'
      render(
        <EdsDataGrid
          emptyMessage={emptyMessage}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.queryByText(emptyMessage)).toBeFalsy()
    })
    it('should not show placeholder message if emptyMessage is not defined', () => {
      const emptyMessage = 'No data to display'
      render(<EdsDataGrid columns={columns} rows={[]} />)
      expect(screen.queryByText(emptyMessage)).toBeFalsy()
    })
  })

  describe('Resize', () => {
    it('should not show resize handles if not specified', () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(screen.queryByTestId('resize-handle')).toBeFalsy()
    })
    it('should not show resize handles columnResizeMode is null', () => {
      render(
        <EdsDataGrid
          columnResizeMode={undefined}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.queryByTestId('resize-handle')).toBeFalsy()
    })
    it('should show resize handles if specified', () => {
      render(
        <EdsDataGrid
          columnResizeMode={'onChange'}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getAllByTestId('resize-handle').length > 0).toBeTruthy()
    })
    it('should resize column if resize handle is dragged', () => {
      render(
        <EdsDataGrid
          columnResizeMode={'onChange'}
          columns={columns}
          rows={data}
        />,
      )
      const firstColumn = screen.getAllByRole('columnheader')[0]
      const resizeHandle = within(firstColumn).getByTestId('resize-handle')
      const initialWidth = Number(firstColumn.style.width.replace('px', ''))
      expect(initialWidth).toBe(100)
      const clientX = Number(resizeHandle.style.left)
      const clientY = Number(resizeHandle.style.top)
      fireEvent.mouseDown(resizeHandle, { clientX, clientY })
      fireEvent.mouseMove(resizeHandle, { clientX: 100, clientY })
      fireEvent.mouseUp(resizeHandle, { clientX: 100, clientY })
      expect(Number(firstColumn.style.width.replace('px', ''))).toBeGreaterThan(
        initialWidth,
      )
    })
  })

  describe('Row selection', () => {
    it('should not call onRowSelectionChange if enableRowSelection is not set', async () => {
      const spy = jest.fn()
      render(
        <EdsDataGrid
          onRowSelectionChange={spy}
          columns={columns}
          rows={data}
        />,
      )
      await userEvent.click(screen.getAllByRole('row')[1])
      expect(spy).toHaveBeenCalledTimes(0)
    })
    it('should call onRowSelectionChange if enableRowSelection is set', async () => {
      const spy = jest.fn()
      render(
        <EdsDataGrid
          enableRowSelection
          onRowSelectionChange={spy}
          onRowClick={(row) =>
            row.getCanSelect() ? row.toggleSelected() : null
          }
          columns={columns}
          rows={data}
        />,
      )
      await userEvent.click(screen.getAllByRole('row')[1])
      expect(spy).toHaveBeenCalledTimes(1)
    })
    it('right-click should call onRowSelectionChange if enableRowSelection is set', async () => {
      const spy = jest.fn()
      render(
        <EdsDataGrid
          enableRowSelection
          onRowSelectionChange={spy}
          onRowContextMenu={(row) =>
            row.getCanSelect() ? row.toggleSelected() : null
          }
          columns={columns}
          rows={data}
        />,
      )

      await userEvent.pointer({
        keys: '[MouseRight]',
        target: screen.getAllByRole('row')[1],
      })

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Paging', () => {
    it('should not show paging if not specified', () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(screen.queryByLabelText('pagination')).toBeFalsy()
    })
    it('should be possible to paginate with varying page-sizes', () => {
      render(
        <EdsDataGrid
          enablePagination={true}
          pageSize={10}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getByLabelText('pagination')).toBeTruthy()
      expect(screen.getByText('1 - 10', { exact: false })).toBeTruthy()
      render(
        <EdsDataGrid
          enablePagination={true}
          pageSize={20}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getByText('1 - 20', { exact: false })).toBeTruthy()
    })
    it('should handle page change', () => {
      render(
        <EdsDataGrid
          enablePagination={true}
          pageSize={10}
          columns={columns}
          rows={data}
        />,
      )
      fireEvent.click(screen.getByLabelText('Go to page 2'))
      expect(screen.getByText('11 - 20', { exact: false })).toBeTruthy()
    })
  })

  describe('Column visibility', () => {
    it('should show all columns if not specified', () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(screen.getAllByRole('columnheader').length).toBe(columns.length)
    })
    it('should hide columns if col-id set to false', () => {
      render(
        <EdsDataGrid
          columnVisibility={{ cargoId: false }}
          columns={columns}
          rows={data}
        />,
      )
      expect(screen.getAllByRole('columnheader').length).toBe(
        columns.length - 1,
      )
    })
    it('should let us know if columns are hidden', async () => {
      const stub = jest.fn()
      render(
        <EdsDataGrid
          columnVisibility={{ cargoId: true }}
          columnVisibilityChange={stub}
          columns={columns}
          rows={data}
        />,
      )
      const thead = screen.getAllByRole('rowgroup')[0]
      await userEvent.click(within(thead).getByRole('button'))
      expect(stub).toHaveBeenCalled()
    })
  })

  describe('Virtual scroll', () => {
    it('should not show virtual scroll if not specified', () => {
      render(<EdsDataGrid columns={columns} rows={data} />)
      expect(
        screen.queryByRole('table')?.classList.contains('virtual'),
      ).toBeFalsy()
    })

    it('should show virtual scroll if enabled', () => {
      const manyRows = generateLargeDataset(200)
      render(
        <EdsDataGrid enableVirtual={true} columns={columns} rows={manyRows} />,
      )
      // Applies virtual class
      expect(
        screen.getByRole('table')?.classList.contains('virtual'),
      ).toBeTruthy()
      // Has 2 virtual padding elements
      // Only bottom scroll element is visible before scrolling
      expect(screen.queryByTestId('virtual-padding-top')).toBeFalsy()
      expect(screen.getByTestId('virtual-padding-bottom')).toBeTruthy()
    })

    it('should not show virtual scroll if enabled, but not needed', () => {
      const fewRows: Data[] = data.slice(0, 2)
      render(
        <EdsDataGrid enableVirtual={true} columns={columns} rows={fewRows} />,
      )
      // Applies virtual class
      expect(
        screen.getByRole('table')?.classList.contains('virtual'),
      ).toBeTruthy()
      // Only bottom scroll element is visible before scrolling
      expect(screen.queryByTestId('virtual-padding-top')).toBeFalsy()
      expect(screen.queryByTestId('virtual-padding-bottom')).toBeFalsy()
    })
  })

  describe('Styling', () => {
    it('should apply styling to the table', () => {
      const cellStyle = () => ({ backgroundColor: 'red' })
      const rowStyle = () => ({ backgroundColor: 'blue' })
      const headerStyle = () => ({ backgroundColor: 'green' })
      const footerStyle = () => ({ backgroundColor: 'yellow', color: 'black' })
      render(
        <EdsDataGrid
          enableFooter // `enableFooter` will show footer
          cellStyle={cellStyle}
          headerStyle={headerStyle}
          footerStyle={footerStyle}
          rowStyle={rowStyle}
          columns={columns}
          rows={data}
        />,
      )
      const firstBodyRow = screen.getAllByRole('row')[1]
      expect(firstBodyRow.style.backgroundColor).toBe('blue')
      expect(
        within(firstBodyRow).getAllByRole('cell')[0].style.backgroundColor,
      ).toBe('red')
      expect(screen.getAllByRole('columnheader')[0].style.backgroundColor).toBe(
        'green',
      )
      const foot = screen.getByTestId('eds-grid-footer')
      expect(foot).toBeTruthy() // Assert Footer is available in the document
      const thElements = within(foot).getAllByRole('columnheader')
      thElements.forEach((th) => {
        expect(th.style.backgroundColor).toBe('yellow')
        expect(th.style.color).toBe('black')
      })
    })

    it('should apply classes to the table + footer enabled', () => {
      const cellClass = () => 'cell-class'
      const rowClass = () => 'row-class'
      const headerClass = () => 'header-class'
      const footerClass = () => 'footer-class'

      render(
        <EdsDataGrid
          enableFooter
          cellClass={cellClass}
          rowClass={rowClass}
          headerClass={headerClass}
          footerClass={footerClass}
          columns={columns}
          rows={data}
        />,
      )
      const firstBodyRow = screen.getAllByRole('row')[1]
      expect(firstBodyRow.classList.contains('row-class')).toBeTruthy()
      const firstCell = within(firstBodyRow).getAllByRole('cell')[0]
      expect(firstCell.classList.contains('cell-class')).toBeTruthy()
      const firstHeader = screen.getAllByRole('columnheader')[0]
      expect(firstHeader.classList.contains('header-class')).toBeTruthy()
      const foot = screen.getByTestId('eds-grid-footer')
      expect(foot).toBeTruthy() // Assert Footer is available in the document
      const thElements = within(foot).getAllByRole('columnheader')
      thElements.forEach((th) => {
        expect(th.classList.contains('footer-class')).toBeTruthy()
      })
    })
  })
})
describe('EdsDataGrid unmounting with virtualization', () => {
  it('should not crash when unmounting virtualized data grid', () => {
    // Create a larger dataset to trigger virtualization
    const manyRows = generateLargeDataset(100)

    // Mock console.error to catch any maximum update depth errors
    const originalError = console.error
    const consoleError = jest.fn()
    console.error = consoleError

    try {
      // Render with virtualization enabled
      const { unmount } = render(
        <EdsDataGrid enableVirtual={true} columns={columns} rows={manyRows} />,
      )

      // Verify it rendered correctly
      expect(
        screen.getByRole('table')?.classList.contains('virtual'),
      ).toBeTruthy()

      // Unmount the component - this should not crash
      unmount()

      // Check that no maximum update depth errors were logged
      const maxUpdateErrors = getMaxUpdateErrors(consoleError)
      expect(maxUpdateErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })

  it('should not crash when quickly mounting and unmounting virtualized data grid', () => {
    // Create a larger dataset to trigger virtualization
    const manyRows = generateLargeDataset(100)

    // Mock console.error to catch any maximum update depth errors
    const originalError = console.error
    const consoleError = jest.fn()
    console.error = consoleError

    try {
      // Rapidly mount and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <EdsDataGrid
            enableVirtual={true}
            columns={columns}
            rows={manyRows}
          />,
        )

        // Immediately unmount
        unmount()
      }

      // Check that no maximum update depth errors were logged
      const maxUpdateErrors = getMaxUpdateErrors(consoleError)
      expect(maxUpdateErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })

  it('should simulate tab navigation scenario from issue', () => {
    // Create large dataset to trigger virtualization
    const manyRows = generateLargeDataset(200)

    // Mock console.error to catch any maximum update depth errors
    const originalError = console.error
    const consoleError = jest.fn()
    console.error = consoleError

    try {
      // Simulate opening a tab with data grid
      const { unmount } = render(
        <div data-testid="tab-content">
          <EdsDataGrid enableVirtual={true} columns={columns} rows={manyRows} />
        </div>,
      )

      // Verify data grid is rendered and virtualized
      expect(screen.getByTestId('tab-content')).toBeInTheDocument()
      expect(
        screen.getByRole('table')?.classList.contains('virtual'),
      ).toBeTruthy()

      // Simulate navigating away from tab (unmounting)
      unmount()

      // Ensure no infinite update loops were triggered
      const maxUpdateErrors = getMaxUpdateErrors(consoleError)
      expect(maxUpdateErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })
})
