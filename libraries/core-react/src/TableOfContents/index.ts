import {
  TableOfContents as BaseComponent,
  TableOfContentsProps,
} from './TableOfContents'
import { LinkItem } from './LinkItem'

type TableOfContentsCompoundProps = typeof BaseComponent & {
  LinkItem: typeof LinkItem
}

const TableOfContents = BaseComponent as TableOfContentsCompoundProps

TableOfContents.LinkItem = LinkItem

export { TableOfContents }
export type { TableOfContentsProps }
