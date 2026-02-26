import { Button, Icon, Typography } from '@equinor/eds-core-react'
import { chevron_down, chevron_right } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import styled from 'styled-components'

export type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl?: string
  timestamp?: Date
}

export type Summary = {
  id: string
  country: string
  price: number
  tax: number
  discount: number
}

const Link = styled.a`
  color: ${tokens.colors.interactive.primary__resting.rgba};
`

export const summaryHelper = createColumnHelper<Summary>()
export const aggregatedSummaryColumns: Array<ColumnDef<Summary>> = [
  summaryHelper.accessor('country', {
    header: 'Country',
    footer: () => 'Total',
    size: 150,
    id: 'country',
  }),
  summaryHelper.accessor('price', {
    header: 'Price',
    footer: (props) => {
      const price = props.table
        .getCoreRowModel()
        .rows.reduce((acc, curr) => (acc = acc + curr?.original?.price || 0), 0)
      return <span>{price.toFixed(2)}</span>
    },
  }),
  summaryHelper.accessor('tax', {
    header: 'Tax',
    footer: (props) => {
      const price = props.table
        .getCoreRowModel()
        .rows.reduce((acc, curr) => (acc = acc + curr?.original?.tax || 0), 0)
      return <span>{price.toFixed(2)}</span>
    },
    size: 250,
    id: 'tax',
  }),
  summaryHelper.accessor('discount', {
    header: 'Discount',
    footer: (props) => {
      const price = props.table
        .getCoreRowModel()
        .rows.reduce(
          (acc, curr) => (acc = acc + curr?.original?.discount || 0),
          0,
        )
      return <span>{price.toFixed(2)}</span>
    },
    size: 250,
    id: 'discount',
  }),
]

export const helper = createColumnHelper<Photo>()

export const columns: Array<ColumnDef<Photo>> = [
  helper.accessor('id', {
    header: () => <span style={{ fontStyle: 'italic' }}>ID</span>,
    size: 100,
    id: 'id',
  }),
  helper.accessor('albumId', {
    header: 'Album ID',
    id: 'albumId',
    size: 150,
  }),
  helper.accessor('title', {
    header: 'Title',
    id: 'title',
    size: 250,
  }),
  helper.accessor('url', {
    header: 'URL',
    cell: (cell) => <Link href={cell.getValue()}>Open</Link>,
    id: 'url',
    size: 150,
  }),
  helper.accessor('thumbnailUrl', {
    header: 'Thumbnail URL',
    id: 'thumbnailUrl',
    size: 180,
  }),
]

type Post = {
  userId: number
  id: number
  title: string
  body: string
  comments: Array<Comment>
}

type Comment = Post & {
  postId: number
  name: string
  email: string
}

export type PostComment = Post & Comment

const postHelper = createColumnHelper<PostComment>()

export const expandColumns: Array<ColumnDef<PostComment>> = [
  postHelper.accessor('id', {
    id: 'expand',
    size: 200,
    header: ({ table }) => (
      <Button
        variant={'ghost_icon'}
        onClick={table.getToggleAllRowsExpandedHandler()}
      >
        <Icon
          data={table.getIsAllRowsExpanded() ? chevron_down : chevron_right}
        />
      </Button>
    ),
    cell: ({ row, getValue }) => (
      <div
        style={{
          display: 'flex',
          paddingLeft: `calc(${row.depth * 2}rem + ${row.getCanExpand() ? '0px' : '2rem'})`,
          alignItems: 'center',
        }}
      >
        {row.getCanExpand() && (
          <Button
            variant={'ghost_icon'}
            style={{
              cursor: 'pointer',
            }}
            onClick={row.getToggleExpandedHandler()}
          >
            <Icon data={row.getIsExpanded() ? chevron_down : chevron_right} />
          </Button>
        )}{' '}
        {getValue()}
      </div>
    ),
  }),
  postHelper.accessor('userId', {
    header: 'User#',
    id: 'userId',
    size: 150,
  }),
  postHelper.accessor('title', {
    header: 'Title',
    id: 'title',
    size: 250,
  }),
  postHelper.accessor('body', {
    header: 'Body',
    cell: (cell) => (
      <Typography
        variant={'cell_text'}
        group={'table'}
        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        {cell.getValue().substring(0, 60)}...
      </Typography>
    ),
    id: 'body',
    size: 250,
  }),
]

export const rowDetailPanelColumns: Array<ColumnDef<PostComment>> = [
  postHelper.display({
    id: 'expand',
    size: 200,
    header: ({ table }) => (
      <Button
        variant={'ghost_icon'}
        onClick={table.getToggleAllRowsExpandedHandler()}
      >
        <Icon
          data={table.getIsAllRowsExpanded() ? chevron_down : chevron_right}
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button variant="ghost_icon" onClick={() => row.toggleExpanded()}>
          <Icon data={row.getIsExpanded() ? chevron_down : chevron_right} />
        </Button>
      </div>
    ),
  }),
  postHelper.accessor('userId', {
    header: 'User#',
    id: 'userId',
    size: 150,
  }),
  postHelper.accessor('title', {
    header: 'Title',
    id: 'title',
    size: 250,
  }),
  postHelper.accessor('body', {
    header: 'Body',
    cell: (cell) => (
      <Typography
        variant={'cell_text'}
        group={'table'}
        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      >
        {cell.getValue().substring(0, 60)}...
      </Typography>
    ),
    id: 'body',
    size: 250,
  }),
]

export const columnTemplate: Array<ColumnDef<Photo>> = [
  helper.accessor('id', {
    header: () => <span style={{ fontStyle: 'italic' }}>JSX</span>,
  }),
  helper.accessor('albumId', {
    header: 'Text',
  }),
  helper.accessor('title', {}),
  helper.accessor('url', {}),
  helper.accessor('thumbnailUrl', {}),
]

export const groupedColumns: Array<ColumnDef<Photo>> = [
  helper.group({
    id: 'ids',
    header: 'IDs',
    columns: [columns[0], columns[1]],
  }),
  helper.group({
    id: 'data',
    header: 'Data',
    columns: [
      columns[2],
      helper.group({
        id: 'urls',
        header: 'URLS',
        columns: [columns[3], columns[4]],
      }),
    ],
  }),
]
