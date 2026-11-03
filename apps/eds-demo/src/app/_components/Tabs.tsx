const tabs = [
  { href: '#employees', label: 'Employees', current: true },
  { href: '#contractors', label: 'Contractors' },
  { href: '#former', label: 'Former' },
]

export function Tabs() {
  return (
    <nav className="tabs" aria-label="People">
      {tabs.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className="tab"
          aria-current={tab.current ? 'page' : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  )
}
