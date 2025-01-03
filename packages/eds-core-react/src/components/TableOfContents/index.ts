'use client'
import {
  TableOfContents as BaseComponent,
  TableOfContentsProps,
} from './TableOfContents'
import { LinkItem, TableOfContentsLinkItemProps } from './LinkItem'

type TableOfContentsCompoundProps = typeof BaseComponent & {
  LinkItem: typeof LinkItem
}

const TableOfContents = BaseComponent as TableOfContentsCompoundProps

TableOfContents.LinkItem = LinkItem

TableOfContents.LinkItem.displayName = 'TableOfContents.LinkItem'

export { TableOfContents }
export type { TableOfContentsProps, TableOfContentsLinkItemProps }
