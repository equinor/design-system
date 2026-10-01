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
  /** Page actions, shown before the theme toggle */
  actions?: ReactNode
  /**
   * Stick to the top while scrolling. Defaults to true; /old turns it off
   * because it has its own sticky step header.
   */
  sticky?: boolean
}

/**
 * The sticky header on every route: product name, navigation, page actions
 * and the settings button. The navigation links are styled as EDS Tabs and sit
 * on the header's bottom edge. One line from 1280px; below that the
 * navigation moves to its own row.
 */
export function AppHeader({ actions, sticky = true }: AppHeaderProps) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header
      className={[
        'border-b border-muted bg-surface text-primary print-hide min-h-12 flex',
        sticky ? 'sticky top-0 z-30' : '',
      ].join(' ')}
    >
      <Link
        href="/"
        className="whitespace-nowrap absolute left-6 top-3 my-auto border-b-2 border-transparent text-ali text-base font-medium text-primary no-underline"
      >
        EDS Colour Palette Generator
      </Link>
      <div className="flex flex-wrap justify-between gap-x-4 max-w-6xl w-full mx-auto">
        <nav
          aria-label="Main"
          // Below xl the nav gets its own scrolling row; the top padding leaves
          // room for the focus ring inside the scroller. The negative bottom
          // margin puts the tab borders on the header's own bottom border.
          className="order-last flex flex-1 -mx-2 -mb-px w-full overflow-x-auto pt-1 xl:order-none xl:mx-0 xl:w-auto xl:overflow-visible xl:pt-0"
        >
          <ul className="m-0 flex list-none items-end p-0 px-2 xl:px-0">
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

        <div className="ml-auto flex items-center gap-2 self-center py-2">
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
