import React, { type ReactNode } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import type { Props } from '@theme/Footer/Layout'

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}
    >
      <div className="container">
        {copyright && <span>{copyright}</span>}
        {links}
      </div>
    </footer>
  )
}
