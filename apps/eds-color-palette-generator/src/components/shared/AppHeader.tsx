'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { settings } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from './Icon'
import { SettingsDialog } from './SettingsDialog'
import { tabClassName } from './tabStyles'

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Theme Builder' },
  { href: '/dataviz', label: 'Data visualisation' },
  { href: '/palette', label: 'Palette editor' },
  { href: '/contrast', label: 'Contrast' },
  { href: '/example', label: 'Examples' },
  { href: '/about', label: 'About' },
]

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

type AppHeaderProps = {
  /** Page actions, shown before the settings button */
  actions?: ReactNode
}

/**
 * The sticky header on every route: product name, navigation, page actions
 * and the settings button. The navigation links are styled as EDS Tabs and sit
 * on the header's bottom edge.
 *
 * From 1280px it is one row of three grid columns. The middle column is as
 * wide as the page content (max-w-6xl), so on wide screens the navigation
 * lines up with the content; the first column is never narrower than the
 * product name, so the name pushes the navigation right instead of covering
 * it. Below 1280px the name and the actions share the first row and the
 * navigation scrolls on its own row.
 */
export function AppHeader({ actions }: AppHeaderProps) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 grid min-h-12 grid-cols-[1fr_auto] gap-x-4 border-b border-muted bg-surface px-6 text-primary print-hide xl:grid-cols-[minmax(max-content,1fr)_minmax(0,72rem)_1fr]">
      <Link
        href="/"
        className="col-start-1 row-start-1 self-center justify-self-start whitespace-nowrap text-base font-medium text-primary no-underline"
      >
        EDS Colour Palette Generator
      </Link>
      {/* Below xl the wrapper drops out of the layout, so the navigation and
          the actions take their own places in the header grid. */}
      <div className="contents xl:col-start-2 xl:row-start-1 xl:flex xl:gap-x-4">
        <nav
          aria-label="Main"
          // Below xl the nav gets its own scrolling row, as wide as the
          // header; the top padding leaves room for the focus ring inside the
          // scroller. The negative bottom margin puts the tab borders on the
          // header's own bottom border.
          className="col-span-2 row-start-2 -mx-6 -mb-px flex overflow-x-auto px-6 pt-1 xl:mx-0 xl:flex-1 xl:overflow-visible xl:px-0 xl:pt-0"
        >
          <ul className="m-0 flex list-none items-end p-0">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={tabClassName(active)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="col-start-2 row-start-1 flex items-center gap-2 self-center py-2 xl:ml-auto">
          {actions}
          <Button
            size="sm"
            iconOnly
            aria-label="Settings"
            aria-haspopup="dialog"
            title="Settings: theme and density"
            onClick={() => setSettingsOpen(true)}
          >
            <Icon data={settings} size={16} />
          </Button>
        </div>
      </div>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  )
}
