import {
  bar_chart,
  dashboard,
  group,
  place,
  settings,
} from '@equinor/eds-icons'
import { classNames, type Styles } from './classNames'
import { Icon } from './Icon'

const items = [
  { href: '#overview', label: 'Overview', icon: dashboard },
  { href: '#people', label: 'People', icon: group, current: true },
  { href: '#locations', label: 'Locations', icon: place },
  { href: '#reports', label: 'Reports', icon: bar_chart },
]

export function SideNav({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <nav className={c('side-nav')} aria-label="Main">
      <ul className={c('nav-list')}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={c('nav-item')}
              aria-current={item.current ? 'page' : undefined}
            >
              <Icon data={item.icon} className={c('nav-icon')} />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className={c('nav-list')}>
        <li>
          <a href="#settings" className={c('nav-item')}>
            <Icon data={settings} className={c('nav-icon')} />
            Settings
          </a>
        </li>
      </ul>
    </nav>
  )
}
