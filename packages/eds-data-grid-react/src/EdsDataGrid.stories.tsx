import { Meta, StoryFn } from '@storybook/react'
import { EdsDataGrid, EdsDataGridProps } from './EdsDataGrid'
import { columns, groupedColumns, Photo } from './stories/columns'
import { data } from './stories/data'
import { CSSProperties, useEffect, useState } from 'react'
import { Button, Checkbox, Paper, Typography } from '@equinor/eds-core-react'
import page from './EdsDataGrid.docs.mdx'
import { Row } from '@tanstack/react-table'
import { tokens } from '@equinor/eds-tokens'

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
      <Paper elevation={'none'}>
        Visible columns:
        <br />
        {columns.map((col) => (
          <>
            <Checkbox
              defaultChecked
              label={col.id ?? 'F'}
              onChange={(e) =>
                setVisible({ ...visible, [col.id]: e.target.checked })
              }
            />
            <br />
          </>
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
  return <EdsDataGrid {...args}  rows={data} />
}

Virtualization.args = {
  stickyHeader: true,
  enableVirtual: true,
  virtualHeight: 500,
}

export const Styling: StoryFn<EdsDataGridProps<Photo>> = (args) => {
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
    const column = columns.findIndex((c) => c.id === columnId)
    return column % 2 === 0
      ? {
          backgroundColor:
            tokens.colors.interactive.table__cell__fill_activated.rgba,
        }
      : {}
  }

  const rowStyle = (row: Row<Photo>): CSSProperties => {
    const id = row.getValue<number>('id')
    if (id % 2 === 0) {
      return {
        backgroundColor:
          tokens.colors.interactive.table__cell__fill_activated.rgba,
      }
    }
    return {}
  }

  return (
    <EdsDataGrid
      cellClass={cellClass}
      cellStyle={cellStyle}
      rowClass={rowClass}
      rowStyle={rowStyle}
      {...args}
    />
  )
}
