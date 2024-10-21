import {
  Button,
  Checkbox,
  Divider,
  Icon,
  Menu,
  Pagination,
  Paper,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'
import { Column, ExpandedState, Row } from '@tanstack/react-table'
import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { EdsDataGrid } from './EdsDataGrid'
import page from './EdsDataGrid.docs.mdx'
import { EdsDataGridProps } from './EdsDataGridProps'
import { FilterWrapper } from './components/FilterWrapper'
import {
  Photo,
  PostComment,
  Summary,
  aggregatedSummaryColumns,
  columns,
  expandColumns,
  groupedColumns,
  helper,
} from './stories/columns'
import { data, summaryData } from './stories/data'
import { Virtualizer } from './types'
import { external_link } from '@equinor/eds-icons'

const meta: Meta<typeof EdsDataGrid<Photo>> = {
  title: 'EDS Data grid',
  component: EdsDataGrid,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
}

meta.args = {
  rows: data,
  columns,
}

export default meta

export const Introduction: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return <EdsDataGrid {...args} />
}

export const ColumnFiltering: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const TitleFilterComponent = ({
    onChange,
    value,
  }: {
    onChange: (value: string) => void
    value: string
  }) => {
    return (
      <TextField
        label={'Custom filter'}
        id={'my-custom-filter'}
        value={value ?? ''}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
      />
    )
  }
  const DateFilterComponent = ({
    onChange,
    value,
  }: {
    onChange: (value: { start: string; end: string }) => void
    value: { start: string; end: string }
  }) => {
    const [start, setStart] = useState<string>(value?.start ?? '')
    const [end, setEnd] = useState<string>(value?.end ?? '')

    useEffect(() => {
      onChange({ start, end })
    }, [start, end, onChange])

    return (
      <div>
        <TextField
          label={'Start'}
          id={'my-custom-date-start'}
          type={'date'}
          value={start}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setStart(e.currentTarget.value)
          }
        />
        <TextField
          label={'End'}
          id={'my-custom-date-end'}
          type={'date'}
          value={end}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEnd(e.currentTarget.value)
          }
        />
      </div>
    )
  }
  const titleCustomFilterColumn = helper.accessor('title', {
    header: (header) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant={'cell_header'} group={'table'}>
            Title (custom filter)
          </Typography>
          <FilterWrapper
            column={header.column}
            CustomComponent={TitleFilterComponent}
          />
        </div>
      )
    },
    id: 'custom-title',
    size: 200,
    filterFn: 'includesString',
    meta: {
      customFilterInput: true,
    },
  })
  const dateColumn = helper.accessor('timestamp', {
    header: (header) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant={'cell_header'} group={'table'}>
            Timestamp (custom filter)
          </Typography>
          <FilterWrapper
            column={header.column}
            CustomComponent={DateFilterComponent}
          />
        </div>
      )
    },
    id: 'timestamp',
    size: 200,
    filterFn: (row, columnId, filterValue: { start?: Date; end?: Date }) => {
      const { start, end } = filterValue
      if (!start && !end) return true
      let startDate = 0
      let endDate = Infinity
      if (start) {
        startDate = new Date(start).getTime()
      }
      if (end) {
        endDate = new Date(end).getTime()
      }
      const value: Date = row.getValue(columnId)
      if (!value) return false
      return value.getTime() > startDate && value.getTime() < endDate
    },
    meta: {
      customFilterInput: true,
    },
  })
  const filterColumns = [...columns]
  filterColumns.splice(3, 0, titleCustomFilterColumn, dateColumn)
  return <EdsDataGrid height={300} {...args} columns={filterColumns} />
}

ColumnFiltering.args = {
  enableColumnFiltering: true,
}

const defaultSizeState = columns
  .map((c) => ({ [c.id]: c.size }))
  .reduce((a, b) => ({ ...a, ...b }), {})

export const ColumnResize: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [size, setSize] = useState(defaultSizeState)
  const randomizeSize = () => {
    setSize(
      Object.keys(defaultSizeState)
        .map((k) => ({ [k]: Math.floor(Math.random() * 200) }))
        .reduce((a, b) => ({ ...a, ...b }), {}),
    )
  }
  const throttle = useRef<number | null>(null)
  return (
    <>
      <Button onClick={randomizeSize}>Randomize</Button>
      <pre>
        columnSizing=
        {JSON.stringify(size, null, 2)}
      </pre>
      <EdsDataGrid
        {...args}
        columnSizing={size}
        onColumnResize={(e) => {
          setSize(e)
          if (throttle.current) {
            clearTimeout(throttle.current)
            throttle.current = null
          }
          throttle.current = setTimeout(() => {
            action('onResize')(e)
          }, 300) as unknown as number
        }}
      />
    </>
  )
}

ColumnResize.args = {
  columnResizeMode: 'onChange',
}

export const RowSelection: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [rowSelectionState, setRowSelectionState] = useState({})
  const [enableMultiRowSelection, setEnableMultiRowSelection] = useState(true)

  return (
    <>
      <Typography>Click a row to select and deselect.</Typography>
      <Divider />
      <Button onClick={() => setRowSelectionState({})}>
        Reset row selection state
      </Button>
      <br />
      <Checkbox
        label="Enable multi row selection"
        checked={enableMultiRowSelection}
        onChange={(event) => setEnableMultiRowSelection(event.target.checked)}
      />
      <pre>
        rowSelectionState=
        {JSON.stringify(rowSelectionState, null, 2)}
      </pre>
      <EdsDataGrid
        {...args}
        enableRowSelection
        enableMultiRowSelection={enableMultiRowSelection}
        rowSelectionState={rowSelectionState}
        onRowSelectionChange={setRowSelectionState}
        onRowClick={(row) => (row.getCanSelect() ? row.toggleSelected() : null)}
        rowStyle={(row) => ({
          cursor: row.getCanSelect() ? 'pointer' : 'inherit',
        })}
        cellStyle={(row) => {
          if (row.getIsSelected()) {
            return {
              backgroundColor:
                tokens.colors.interactive.table__cell__fill_activated.rgba,
            }
          }

          return undefined
        }}
      />
    </>
  )
}

RowSelection.args = {
  columnResizeMode: 'onChange',
} satisfies Partial<EdsDataGridProps<Photo>>

const SimpleMenu = ({
  text,
  top,
  left,
  onHide,
}: {
  text: string
  top: number
  left: number
  onHide: () => void
}): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  return (
    <div
      id="anchor"
      ref={setAnchorEl}
      style={{
        position: 'absolute',
        top: top,
        left: left,
      }}
    >
      <Menu
        open
        id="menu-as"
        aria-labelledby="anchor-as"
        onClose={onHide}
        anchorEl={anchorEl}
        placement="right-start"
      >
        <Menu.Section title={text}>
          <Menu.Item
            as="a"
            onClick={onHide}
            href="https://eds.equinor.com/"
            target="_blank"
            style={{ justifyContent: 'space-between' }}
          >
            <Typography group="navigation" variant="menu_title" as="span">
              EDS homepage
            </Typography>
            <Icon data={external_link} size={16} />
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={onHide}
            href="https://equinor.com/"
            target="_blank"
            style={{ justifyContent: 'space-between' }}
          >
            <Typography group="navigation" variant="menu_title" as="span">
              Equinor.com
            </Typography>
            <Icon data={external_link} size={16} />
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </div>
  )
}

export const RowContextMenu: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuProps, setMenuProps] = useState<{
    text: string
    top: number
    left: number
    onHide: () => void
  } | null>(null)

  const showMenu = (
    row: Row<Photo>,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setMenuProps({
      text: `Menu for row id: ${row.original.id}`,
      top: event.pageY,
      left: event.pageX,
      onHide: () => setIsOpen(false),
    })
    setIsOpen(true)
  }

  return (
    <>
      <Typography>Right click a row to open a basic popup.</Typography>
      <Divider />
      <br />
      {isOpen && <SimpleMenu {...menuProps} />}
      <EdsDataGrid {...args} onRowContextMenu={showMenu} />
    </>
  )
}

RowContextMenu.args = {} satisfies Partial<EdsDataGridProps<Photo>>

export const Paging: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return <EdsDataGrid {...args} />
}

Paging.args = {
  enablePagination: true,
  pageSize: 10,
}

export const ExternalPaging: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return (
    <>
      <div>
        <Typography variant={'body_long'}>
          Using externalPaginator gives you control over setting the appropriate
          rows yourself.
        </Typography>
        <Typography variant={'body_long'}>
          This is useful for e.g server-side pagination
        </Typography>
      </div>
      <EdsDataGrid
        {...args}
        externalPaginator={
          <Pagination
            itemsPerPage={10}
            totalItems={40}
            withItemIndicator
            onChange={(event, page) => {
              action(`Page changed`)(page)
            }}
          />
        }
      />
    </>
  )
}

export const ColumnGrouping: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return <EdsDataGrid {...args} />
}

ColumnGrouping.args = {
  rows: data,
  columns: groupedColumns,
  height: 400,
  width: '100%',
  enableVirtual: true,
  scrollbarHorizontal: true,
}

export const Sortable: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return <EdsDataGrid {...args} />
}

Sortable.args = {
  enableSorting: true,
  columns: groupedColumns,
  sortingState: [
    {
      desc: true,
      id: 'id',
    },
  ],
}

export const ManualSorting: StoryFn<EdsDataGridProps<Photo>> = (
  args: EdsDataGridProps<Photo>,
) => {
  return <EdsDataGrid {...args} />
}

ManualSorting.args = {
  enableSorting: true,
  manualSorting: true,
  onSortingChange: (c) => {
    if (typeof c === 'function') {
      action('Change sorting')(c([]))
    } else {
      action('Change sorting')(c)
    }
  },
  columns: groupedColumns,
}

export const ColumnPinning: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const { columnPinState } = args
  return (
    <>
      <Typography as={'div'} style={{ whiteSpace: 'pre' }}>
        {JSON.stringify(columnPinState, null, 2)}
      </Typography>
      <EdsDataGrid {...args} />
    </>
  )
}

ColumnPinning.args = {
  columnPinState: {
    right: [columns[0].id, columns.at(1).id],
    left: [columns.at(2).id],
  },
  scrollbarHorizontal: true,
  stickyHeader: true,
  width: 700,
  columns: columns,
  height: 500,
  rows: data,
  enableFooter: true,
  stickyFooter: true,
}

export const ColumnPinningWithFooter: StoryFn<EdsDataGridProps<Summary>> = (
  args,
) => {
  const { columnPinState } = args
  return (
    <>
      <Typography as={'div'} style={{ whiteSpace: 'pre' }}>
        {JSON.stringify(columnPinState, null, 2)}
      </Typography>
      <EdsDataGrid {...args} />
    </>
  )
}

ColumnPinningWithFooter.args = {
  columnPinState: {
    left: [aggregatedSummaryColumns.at(0).id],
  },
  scrollbarHorizontal: true,
  stickyHeader: true,
  width: 700,
  columns: aggregatedSummaryColumns,
  height: 500,
  rows: summaryData,
  enableFooter: true,
  stickyFooter: true,
  headerClass: () => 'header-class',
  footerClass: () => 'footer-class',
}

export const ColumnOrdering: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const ids = ['id', 'albumId', 'title', 'url', 'thumbnailUrl']
  const [sort, setSort] = useState<string[]>(ids)

  function shuffle(array: Array<string>) {
    let currentIndex = array.length
    let randomIndex: number

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    return [...array]
  }

  return (
    <>
      <Typography variant={'body_long'}>
        Active sort: {JSON.stringify(sort, null, 2)}
      </Typography>
      <Button onClick={() => setSort(shuffle(ids))}>Randomize</Button>
      <Button onClick={() => setSort(ids)}>Reset</Button>
      <EdsDataGrid columnOrder={sort} {...args} />
    </>
  )
}

export const ScrollToIndex: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [index, setIndex] = useState<number>(100)

  const rowVirtualizerInstanceRef =
    useRef<Virtualizer<HTMLDivElement, Element>>(null)

  const scrollToIndex = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    rowVirtualizerInstanceRef.current?.scrollToIndex(index, {
      align: 'center',
      behavior: 'smooth',
    })
  }

  return (
    <>
      <form
        style={{
          display: 'flex',
          alignItems: 'end',
          gap: '1rem',
          marginBottom: '1rem',
        }}
        onSubmit={scrollToIndex}
      >
        <TextField
          id="index"
          type="number"
          label="Index"
          name="index"
          value={String(index)}
          style={{ width: '8rem' }}
          min={0}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setIndex(e.target.valueAsNumber)
          }
        />
        <Button type="submit" style={{ flexShrink: 0 }} disabled={isNaN(index)}>
          Scroll To Index
        </Button>
      </form>

      <EdsDataGrid
        {...args}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      />
    </>
  )
}

ScrollToIndex.args = {
  stickyHeader: true,
  enableVirtual: true,
  height: 300,
  rows: Array.from(new Array(100)).flatMap((_, copyNumber) =>
    data.map<(typeof data)[number]>((item, index, { length }) => ({
      ...item,
      id: index + copyNumber * length,
    })),
  ),
}

export const HideShowColumns: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [visible, setVisible] = useState<{ [key in keyof Photo]?: boolean }>({})
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px auto' }}>
      <Paper
        elevation={'none'}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Typography
          variant="body_short_bold"
          style={{ padding: '16px 8px 0 16px' }}
        >
          Visible columns:
        </Typography>
        {columns.map((col) => (
          <Checkbox
            key={col.id}
            defaultChecked
            label={col.id ?? 'F'}
            onChange={(e) =>
              setVisible({ ...visible, [col.id]: e.target.checked })
            }
          />
        ))}
      </Paper>
      <EdsDataGrid
        columnVisibility={visible}
        columnVisibilityChange={setVisible}
        {...args}
      />
    </div>
  )
}

export const Virtualization: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const [data, setData] = useState<Array<Photo>>([])

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
  return <EdsDataGrid {...args} rows={data} />
}

Virtualization.args = {
  stickyHeader: true,
  enableVirtual: true,
  height: 500,
}

export const ExpandRows: StoryFn<EdsDataGridProps<PostComment>> = (args) => {
  const [data, setData] = useState<Array<PostComment>>([])
  const [expansionState, setExpansionState] = useState<ExpandedState>({})

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts`, { signal }).then(
        (r) => r.json() as Promise<Array<PostComment>>,
      ),
      fetch(`https://jsonplaceholder.typicode.com/comments`, { signal }).then(
        (r) => r.json() as Promise<Array<PostComment>>,
      ),
    ])
      .then(([posts, comments]) =>
        posts.map((p) => ({
          ...p,
          comments: comments
            .filter((c) => c.postId === p.id)
            .map((c) => ({ ...c, comments: [{ ...c, id: c.id * 1000 }] })),
        })),
      )
      .then((posts) => setData(posts))
      .catch(console.error)

    return () => {
      abortController.abort()
    }
  }, [])
  return (
    <EdsDataGrid
      {...args}
      columns={expandColumns}
      rows={data}
      expansionState={expansionState}
      setExpansionState={setExpansionState}
      getSubRows={(r) => r.comments}
    />
  )
}

ExpandRows.args = {
  stickyHeader: true,
  enableVirtual: true,
  height: 500,
}

export const Styling: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  const borderColor = tokens.colors.ui.background__medium.rgba
  const rowClass = (row: Row<Photo>) => {
    const id = row.getValue<number>('id')
    if (id % 2 === 0) {
      return 'even'
    }
    return 'odd'
  }
  const cellClass = (row: Row<Photo>, columnId: string) => {
    const column = columns.findIndex((c) => c.id === columnId)
    return column % 2 === 0 ? 'even' : 'odd'
  }

  const cellStyle = (row: Row<Photo>, columnId: string): CSSProperties => {
    const css: CSSProperties = {}
    if (columnId === 'id') {
      css.borderLeft = `1px solid ${borderColor}`
    }
    css.borderRight = `1px solid ${borderColor}`
    return css
  }

  const rowStyle = (row: Row<Photo>): CSSProperties => {
    const id = row.getValue<number>('id')
    if (id % 10 === 0) {
      return {
        backgroundColor:
          tokens.colors.interactive.table__cell__fill_activated.rgba,
      }
    }
    return {}
  }

  const headerClass = (col: Column<Photo>) => col.id

  const headerStyle = (col: Column<Photo>): CSSProperties => {
    const css: CSSProperties = {}
    if (col.id === 'id') {
      css.borderLeft = `1px solid ${borderColor}`
    }
    css.borderRight = `1px solid ${borderColor}`
    return css
  }

  return (
    <EdsDataGrid
      cellClass={cellClass}
      headerStyle={headerStyle}
      headerClass={headerClass}
      cellStyle={cellStyle}
      rowClass={rowClass}
      rowStyle={rowStyle}
      {...args}
    />
  )
}
