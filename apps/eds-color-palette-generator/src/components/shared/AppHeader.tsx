'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

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

const NAV_LINK =
  'inline-flex min-h-7 items-center whitespace-nowrap rounded px-2 text-sm transition-colors duration-150'
const NAV_LINK_ACTIVE = 'bg-accent-selected text-primary font-medium'
const NAV_LINK_IDLE =
  'text-secondary hover:bg-neutral-muted hover:text-primary active:bg-neutral-muted-hover'

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
 * and the theme toggle. One line from 1024px; below that the navigation
 * moves to its own row.
 */
export function AppHeader({ actions, sticky = true }: AppHeaderProps) {
  const pathname = usePathname()

  return (
    <header
      className={[
        'border-b border-muted bg-surface text-primary print-hide',
        sticky ? 'sticky top-0 z-30' : '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-2">
        <Link
          href="/"
          className="whitespace-nowrap text-base font-medium text-primary no-underline"
        >
          EDS Colour Palette Generator
        </Link>

        <nav
          aria-label="Main"
          // Vertical padding leaves room for the focus ring inside the scroller
          className="order-last -mx-2 w-full overflow-x-auto py-1 lg:order-none lg:mx-0 lg:w-auto lg:overflow-visible lg:py-0"
        >
          <ul className="m-0 flex list-none items-center gap-0.5 p-0 px-2 lg:px-0">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      NAV_LINK,
                      active ? NAV_LINK_ACTIVE : NAV_LINK_IDLE,
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
