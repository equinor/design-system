import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'

export type Photo = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

const helper = createColumnHelper<Photo>()

const Link = styled.a`
  color: ${tokens.colors.interactive.primary__resting.rgba};
`

export const columns: Array<ColumnDef<Photo>> = [
  helper.accessor('id', {
    header: () => <span style={{ fontStyle: 'italic' }}>ID</span>,
    id: 'id',
  }),
  helper.accessor('albumId', {
    header: 'Album ID',
    id: 'albumId',
  }),
  helper.accessor('title', {
    header: 'Title',
    id: 'title',
  }),
  helper.accessor('url', {
    header: 'URL',
    cell: (cell) => <Link href={cell.getValue()}>Open</Link>,
    id: 'url',
  }),
  helper.accessor('thumbnailUrl', {
    header: 'Thumbnail URL',
    id: 'thumbnailUrl',
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
