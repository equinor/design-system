import { classNames, type Styles } from './classNames'

const tabs = [
  { href: '#employees', label: 'Employees', current: true },
  { href: '#contractors', label: 'Contractors' },
  { href: '#former', label: 'Former' },
]

export function Tabs({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <nav className={c('tabs')} aria-label="People">
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className={c('tab')}
          aria-current={tab.current ? 'page' : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  )
}
