import { render, screen } from '@testing-library/react'
import { EdsDataGrid } from '../EdsDataGrid'
import { columns } from './columns'
import { Data, data } from './data'

describe('EdsDataGrid unmounting with virtualization', () => {
  it('should not crash when unmounting virtualized data grid', () => {
    // Create a larger dataset to trigger virtualization
    let manyRows: Array<Data> = []
    for (let i = 0; i < 100; i++) {
      manyRows = [...manyRows, ...data]
    }

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
      const maxUpdateErrors = consoleError.mock.calls.filter(
        (call: unknown[]) =>
          call.some(
            (arg: unknown) =>
              typeof arg === 'string' &&
              arg.includes('Maximum update depth exceeded'),
          ),
      )

      expect(maxUpdateErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })

  it('should not crash when quickly mounting and unmounting virtualized data grid', () => {
    // Create a larger dataset to trigger virtualization
    let manyRows: Array<Data> = []
    for (let i = 0; i < 100; i++) {
      manyRows = [...manyRows, ...data]
    }

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
      const maxUpdateErrors = consoleError.mock.calls.filter(
        (call: unknown[]) =>
          call.some(
            (arg: unknown) =>
              typeof arg === 'string' &&
              arg.includes('Maximum update depth exceeded'),
          ),
      )

      expect(maxUpdateErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })
})
