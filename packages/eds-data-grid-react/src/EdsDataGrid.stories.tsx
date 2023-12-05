import { Meta, StoryFn } from '@storybook/react'
import { EdsDataGrid } from './EdsDataGrid'
import { columns, groupedColumns, Photo } from './stories/columns'
import { data } from './stories/data'
import { CSSProperties, useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Pagination,
  Paper,
  Typography,
} from '@equinor/eds-core-react'
import page from './EdsDataGrid.docs.mdx'
import { Column, Row } from '@tanstack/react-table'
import { tokens } from '@equinor/eds-tokens'
import { action } from '@storybook/addon-actions'
import { EdsDataGridProps } from './EdsDataGridProps'

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
  return <EdsDataGrid {...args} />
}

ColumnFiltering.args = {
  enableColumnFiltering: true,
}

export const ColumnResize: StoryFn<EdsDataGridProps<Photo>> = (args) => {
  return <EdsDataGrid {...args} />
}

ColumnResize.args = {
  columnResizeMode: 'onChange',
}

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
  virtualHeight: 500,
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
