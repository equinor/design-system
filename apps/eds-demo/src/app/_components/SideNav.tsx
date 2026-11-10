import {
  bar_chart,
  dashboard,
  group,
  place,
  settings,
} from '@equinor/eds-icons'
import { Icon } from '@equinor/eds-core-react/next'

const items = [
  { href: '#overview', label: 'Overview', icon: dashboard },
  { href: '#people', label: 'People', icon: group, current: true },
  { href: '#locations', label: 'Locations', icon: place },
  { href: '#reports', label: 'Reports', icon: bar_chart },
]

export function SideNav() {
  return (
    <nav className="side-nav" aria-label="Main">
      <ul className="nav-list">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="nav-item"
              aria-current={item.current ? 'page' : undefined}
            >
              <Icon data={item.icon} size="lg" className="nav-icon" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="nav-list">
        <li>
          <a href="#settings" className="nav-item">
            <Icon data={settings} size="lg" className="nav-icon" />
            Settings
          </a>
        </li>
      </ul>
    </nav>
  )
}
