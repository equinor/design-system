import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import LinkItem from '@theme/Footer/LinkItem'
import type { Props } from '@theme/Footer/Links/MultiColumn'

type ColumnType = Props['columns'][number]
type ColumnItemType = ColumnType['items'][number]

function ColumnLinkItem({ item }: { item: ColumnItemType }) {
  return item.html ? (
    <div
      className={clsx('footer__item', item.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  ) : (
    <div key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </div>
  )
}

function Column({ column }: { column: ColumnType }) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.footer.column,
        'col footer__col',
        column.className,
      )}
    >
      {/* <div className="footer__title">{column.title}</div> */}
      <div className="footer__items clean-list">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function FooterLinksMultiColumn({ columns }: Props): ReactNode {
  return (
    <div className="row footer__links">
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </div>
  )
}
