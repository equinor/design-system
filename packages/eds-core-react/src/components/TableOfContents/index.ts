import {
  TableOfContents as BaseComponent,
  TableOfContentsProps,
} from './TableOfContents'
import {
  LinkItem as TableOfContentsLinkItem,
  TableOfContentsLinkItemProps,
} from './LinkItem'

type TableOfContentsCompoundProps = typeof BaseComponent & {
  LinkItem: typeof TableOfContentsLinkItem
}

const TableOfContents = BaseComponent as TableOfContentsCompoundProps

TableOfContents.LinkItem = TableOfContentsLinkItem

TableOfContents.LinkItem.displayName = 'TableOfContents.LinkItem'

export { TableOfContents, TableOfContentsLinkItem }
export type { TableOfContentsProps, TableOfContentsLinkItemProps }
