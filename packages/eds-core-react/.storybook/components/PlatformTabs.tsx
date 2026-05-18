import { useState, useRef, type ReactNode, type KeyboardEvent } from 'react'

type Tab = 'react' | 'native'

type PlatformTabsProps = {
  mobile?: ReactNode
  children?: ReactNode
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'native', label: 'React Native' },
]

export const PlatformTabs = ({ mobile, children }: PlatformTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('react')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (!mobile) return <>{children}</>

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const next = (index + 1) % TABS.length
      tabRefs.current[next]?.focus()
      setActiveTab(TABS[next].id)
    } else if (e.key === 'ArrowLeft') {
      const prev = (index - 1 + TABS.length) % TABS.length
      tabRefs.current[prev]?.focus()
      setActiveTab(TABS[prev].id)
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Platform"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--eds-color-border-medium, #DCDCDC)',
          marginBottom: '1.5rem',
        }}
      >
        {TABS.map(({ id, label }, index) => (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            role="tab"
            aria-selected={activeTab === id}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily:
                'var(--eds-typography-ui-body-font-family), sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              color:
                activeTab === id
                  ? 'var(--eds-color-interactive-primary, #007079)'
                  : 'var(--eds-color-text-subtle, #6F6F6F)',
              borderBottom:
                activeTab === id
                  ? '1px solid var(--eds-color-interactive-primary, #007079)'
                  : '1px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {activeTab === 'react' ? children : mobile}
    </div>
  )
}
