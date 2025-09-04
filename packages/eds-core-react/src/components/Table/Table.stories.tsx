import { useEffect, useState, useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import styled from 'styled-components'
import { StoryFn, Meta } from '@storybook/react'
import {
  Table,
  TableProps,
  Typography,
  Icon,
  CellProps,
  TopBar,
  Menu,
  Button,
  EdsProvider,
  EdsProviderProps,
} from '../..'
import { arrow_down, arrow_up, accessible } from '@equinor/eds-icons'
import { data, columns, Column, Data, SortDirection } from '../../stories/data'
import { toCellValues } from '../../stories/toCellValues'
import { Stack } from './../../../.storybook/components'
import page from './Table.docs.mdx'

Icon.add({ arrow_down, arrow_up })

const { Caption, Body, Row, Cell, Head, Foot } = Table

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  subcomponents: { Caption, Head, Body, Cell, Row, Foot },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

export default meta

export const introduction: StoryFn<TableProps> = (args) => {
  const cellValues = toCellValues(data, columns)

  return (
    <Table {...args}>
      <Table.Caption>
        <Typography variant="h2" style={{ marginBottom: '16px' }}>
          Fruits cost price
        </Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {cellValues?.map((row) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue) => (
              <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={columns.length}>Footer</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  )
}

introduction.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="stretch">
        <Story />
      </Stack>
    )
  },
]

export const FixedTableHeader: StoryFn<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  return (
    <div style={{ height: '200px', overflow: 'auto', display: 'grid' }}>
      <Table>
        <Table.Caption>
          <Typography variant="h2" style={{ marginBottom: '16px' }}>
            Fruits cost price
          </Typography>
        </Table.Caption>
        <Table.Head sticky>
          <Table.Row>
            {columns.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row) => (
            <Table.Row key={row.toString()}>
              {row.map((cellValue) => (
                <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
FixedTableHeader.storyName = 'Fixed table header'

export const FixedTableHeaderAndFooter: StoryFn<TableProps> = () => {
  const cellValues = toCellValues(data, columns)
  const total = data.reduce((acc, curr) => acc + curr?.price, 0)
  return (
    <div style={{ height: '400px', overflow: 'auto', display: 'grid' }}>
      <Table>
        <Table.Caption>
          <Typography variant="h2" style={{ marginBottom: '16px' }}>
            Fruits cost price
          </Typography>
        </Table.Caption>
        <Table.Head sticky>
          <Table.Row>
            {columns.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row) => (
            <Table.Row key={row.toString()}>
              {row.map((cellValue) => (
                <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Foot sticky>
          <Table.Row>
            <Table.Cell colSpan={columns?.length - 1}>Total</Table.Cell>
            <Table.Cell colSpan={1}>{total}</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>
    </div>
  )
}

FixedTableHeaderAndFooter.storyName = 'Fixed table header and footer'

export const CompactTable: StoryFn<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  const [state, setState] = useState<{
    isOpen: boolean
    density: EdsProviderProps['density']
  }>({
    isOpen: false,
    density: 'compact',
  })

  const { density, isOpen } = state

  const setDensity = (density: 'comfortable' | 'compact') =>
    setState((prevState) => ({ ...prevState, density }))

  const openMenu = () => {
    setState((prevState) => ({ ...prevState, isOpen: true }))
  }

  const closeMenu = () =>
    setState((prevState) => ({ ...prevState, isOpen: false }))

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu()
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu()
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  const referenceElement = useRef<HTMLButtonElement>(null)

  return (
    <>
      <TopBar>
        <TopBar.Header>Compact table with switcher</TopBar.Header>
        <TopBar.Actions>
          <Button
            ref={referenceElement}
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            onKeyDown={onKeyPress}
          >
            <Icon data={accessible} title="accessible"></Icon>
          </Button>
          <Menu
            id="menu-on-button"
            open={isOpen}
            aria-labelledby="menuButton"
            anchorEl={referenceElement.current}
            onClose={closeMenu}
          >
            <Menu.Section title="Density">
              <Menu.Item onClick={() => setDensity('comfortable')}>
                Comfortable
              </Menu.Item>
              <Menu.Item onClick={() => setDensity('compact')}>
                Compact
              </Menu.Item>
            </Menu.Section>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <EdsProvider density={density}>
        <Table>
          <Table.Caption>
            <Typography variant="h2" style={{ marginBottom: '16px' }}>
              Fruits cost price
            </Typography>
          </Table.Caption>
          <Table.Head>
            <Table.Row>
              {columns.map((col) => (
                <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {cellValues?.map((row) => (
              <Table.Row key={row.toString()}>
                {row.map((cellValue) => (
                  <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Foot>
            <Table.Row>
              <Table.Cell colSpan={5}>Footer</Table.Cell>
            </Table.Row>
          </Table.Foot>
        </Table>
      </EdsProvider>
    </>
  )
}
CompactTable.storyName = 'Compact table'
CompactTable.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="stretch">
        <Story />
      </Stack>
    )
  },
]

const SortCell = styled(Cell)<{ isSorted: boolean } & CellProps>`
  svg {
    visibility: ${({ isSorted }) => (isSorted ? 'visible' : 'hidden')};
  }

  &:hover {
    svg {
      visibility: visible;
    }
  }
`
export const Sortable: StoryFn<TableProps> = () => {
  const [state, setState] = useState<{
    columns: Column[]
    cellValues?: string[][]
  }>({ columns })

  const onSortClick = (sortCol: Column) => {
    const updateColumns = state.columns.map((col) => {
      if (sortCol.accessor === col.accessor) {
        let isSorted = true
        let sortDirection: SortDirection = 'none'
        switch (sortCol.sortDirection) {
          case 'descending':
            isSorted = false
            sortDirection = 'none'
            break
          case 'ascending':
            sortDirection = 'descending'
            break
          default:
            sortDirection = 'ascending'
            break
        }

        return {
          ...sortCol,
          isSorted,
          sortDirection,
        }
      }
      return {
        ...col,
        isSorted: false,
        sortDirection: col.sortDirection
          ? ('none' as SortDirection)
          : undefined,
      }
    })

    setState({ ...state, columns: updateColumns })
  }

  const sortData = useCallback(
    (data: Data[]) =>
      data.sort((left, right) => {
        const sortedCol = state.columns.find((col) => col.isSorted)
        if (!sortedCol) {
          return 1
        }
        const { sortDirection, accessor } = sortedCol
        if (sortDirection === 'ascending') {
          return left[accessor] > right[accessor] ? 1 : -1
        }
        if (sortDirection === 'descending') {
          return left[accessor] < right[accessor] ? 1 : -1
        }
      }),
    [state.columns],
  )

  useEffect(() => {
    if (state.columns) {
      const sorted = sortData(data)
      const cellValues = toCellValues(sorted, columns)
      setState((prevState) => ({ ...prevState, cellValues }))
    }
  }, [state.columns, setState, sortData])

  return (
    <Table>
      <Table.Caption>
        <Typography variant="h2" style={{ marginBottom: '16px' }}>
          Fruits cost price
        </Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {state.columns.map((col) => (
            <SortCell
              sort={col.sortDirection}
              key={`head-${col.accessor}`}
              onClick={col.sortDirection ? () => onSortClick(col) : undefined}
              isSorted={col.isSorted}
            >
              {col.name}
              <Icon
                name={
                  col.sortDirection === 'descending' ? 'arrow_down' : 'arrow_up'
                }
              />
            </SortCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {state.cellValues?.map((row) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue) => (
              <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell colSpan={5}>Footer</Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  )
}
Sortable.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="stretch">
        <Story />
      </Stack>
    )
  },
]

type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const VirtualScrollingWithFixedFooter: StoryFn<TableProps> = () => {
  const [data, setData] = useState<Array<Photo>>([])
  const parentRef = useRef()

  const estimateSize = useCallback(() => {
    return 48
  }, [])

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    fetch(`https://jsonplaceholder.typicode.com/photos`, { signal })
      .then((r) => r.json())
      .then((d: Photo[]) => {
        setData(d.slice(0, 100))
      })
      .catch((err: Error) => {
        console.error(`Error: ${err.message}`)
      })
    return () => {
      abortController.abort()
    }
  }, [])

  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0

  return (
    <div
      style={{
        height: '600px',
        overflow: 'auto',
      }}
      ref={parentRef}
    >
      <Table
        style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}
      >
        <Table.Head sticky>
          <Table.Row>
            <Table.Cell>
              <div style={{ width: '40px' }}>ID</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '70px' }}>Album ID</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '400px' }}>Title</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '120px' }}>URL</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '120px' }}>Thumbnail url</div>
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell style={{ height: `${paddingTop}px` }}></Table.Cell>
          </Table.Row>
          {virtualRows.map((virtualRow) => {
            const row: Photo = data[virtualRow.index]

            return (
              <Table.Row key={row.id}>
                <Table.Cell>
                  <div style={{ width: '40px' }}>{row.id}</div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '70px' }}>{row.albumId}</div>
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      width: '400px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.title}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '120px' }}>
                    {' '}
                    <Typography link href={row.url} target="_blank">
                      Open image
                    </Typography>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '120px' }}>
                    {' '}
                    <Typography link href={row.thumbnailUrl} target="_blank">
                      Open thumbnail
                    </Typography>
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          })}
          <Table.Row>
            <Table.Cell style={{ height: `${paddingBottom}px` }}></Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot sticky>
          <Table.Row>
            <Table.Cell colSpan={5}>{`Total ${data?.length} items`}</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>
    </div>
  )
}

export const VirtualScrolling: StoryFn<TableProps> = () => {
  const [data, setData] = useState<Array<Photo>>([])
  const parentRef = useRef()

  const estimateSize = useCallback(() => {
    return 48
  }, [])

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    fetch(`https://jsonplaceholder.typicode.com/photos`, { signal })
      .then((r) => r.json())
      .then((d: Photo[]) => {
        setData(d)
      })
      .catch((err: Error) => {
        console.error(`Error: ${err.message}`)
      })
    return () => {
      abortController.abort()
    }
  }, [])

  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0

  return (
    <div
      style={{
        height: '600px',
        overflow: 'auto',
      }}
      ref={parentRef}
    >
      <Table
        style={{ width: '100%', paddingLeft: '15px', paddingRight: '15px' }}
      >
        <Table.Head sticky>
          <Table.Row>
            <Table.Cell>
              <div style={{ width: '40px' }}>ID</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '70px' }}>Album ID</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '400px' }}>Title</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '120px' }}>URL</div>
            </Table.Cell>
            <Table.Cell>
              <div style={{ width: '120px' }}>Thumbnail url</div>
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell style={{ height: `${paddingTop}px` }}></Table.Cell>
          </Table.Row>
          {virtualRows.map((virtualRow) => {
            const row: Photo = data[virtualRow.index]

            return (
              <Table.Row key={row.id}>
                <Table.Cell>
                  <div style={{ width: '40px' }}>{row.id}</div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '70px' }}>{row.albumId}</div>
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      width: '400px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.title}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '120px' }}>
                    {' '}
                    <Typography link href={row.url} target="_blank">
                      Open image
                    </Typography>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div style={{ width: '120px' }}>
                    {' '}
                    <Typography link href={row.thumbnailUrl} target="_blank">
                      Open thumbnail
                    </Typography>
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          })}
          <Table.Row>
            <Table.Cell style={{ height: `${paddingBottom}px` }}></Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell colSpan={5}>Footer</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>
    </div>
  )
}

export const FirefoxHeaderWrapping: StoryFn<TableProps> = () => {
  const longHeaderColumns = [
    {
      name: 'Very Long Header That Should Wrap Properly In Firefox Browser',
      accessor: 'fruit',
    },
    {
      name: 'Another Extremely Long Header Text That Tests Text Wrapping Behavior',
      accessor: 'supplier',
    },
    { name: 'Short', accessor: 'price' },
    {
      name: 'This Is Yet Another Very Long Header That Should Test The Firefox Wrapping Bug Fix',
      accessor: 'organic',
    },
    {
      name: 'Final Long Header Text To Ensure Consistent Behavior Across All Columns',
      accessor: 'vegan',
    },
  ]

  const testData = [
    {
      fruit: 'Apple',
      supplier: 'Supplier A',
      price: 10,
      organic: 'Yes',
      vegan: 'Yes',
    },
    {
      fruit: 'Banana',
      supplier: 'Supplier B',
      price: 5,
      organic: 'No',
      vegan: 'Yes',
    },
    {
      fruit: 'Orange',
      supplier: 'Supplier C',
      price: 8,
      organic: 'Yes',
      vegan: 'Yes',
    },
  ]

  const cellValues = testData.map((row) =>
    longHeaderColumns.map((col) =>
      String(row[col.accessor as keyof typeof row]),
    ),
  )

  return (
    <div style={{ width: '600px' }}>
      <Table>
        <Table.Caption>
          <Typography variant="h2" style={{ marginBottom: '16px' }}>
            Firefox Header Wrapping Test
          </Typography>
          <Typography variant="body_short" style={{ marginBottom: '16px' }}>
            This table tests that long header text wraps properly in Firefox
            without breaking out of the header row. The table width is
            constrained to force wrapping.
          </Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            {longHeaderColumns.map((col) => (
              <Table.Cell
                key={`head-${col.accessor}`}
                style={{ width: '120px' }}
              >
                {col.name}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row, index) => (
            <Table.Row key={index}>
              {row.map((cellValue, cellIndex) => (
                <Table.Cell key={`${index}-${cellIndex}`}>
                  {cellValue}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell colSpan={longHeaderColumns.length}>
              Test completed - headers should wrap without overflow
            </Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>
    </div>
  )
}

FirefoxHeaderWrapping.storyName = 'Firefox Header Wrapping Test'
FirefoxHeaderWrapping.parameters = {
  docs: {
    description: {
      story:
        'Tests that long header text wraps properly in Firefox browsers without breaking out of the header row container. Compare behavior between Firefox and Chrome.',
    },
  },
}

FirefoxHeaderWrapping.decorators = [
  (Story) => {
    return (
      <Stack direction="column" align="stretch">
        <Story />
      </Stack>
    )
  },
]
