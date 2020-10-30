import { TableOfContents as BaseComponent } from './TableOfContents'
import { LinkItem } from './LinkItem'

type TableOfContentsProps = typeof BaseComponent & {
  LinkItem: typeof LinkItem
}

const TableOfContents = BaseComponent as TableOfContentsProps

TableOfContents.LinkItem = LinkItem

export { TableOfContents, TableOfContentsProps }
