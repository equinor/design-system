import { useState, ReactNode, useEffect, CSSProperties } from 'react'

type PlatformTabsProps = {
  mobile?: ReactNode
}

export const PlatformTabs = ({ mobile }: PlatformTabsProps) => {
  const [activeTab, setActiveTab] = useState<'web' | 'mobile'>('web')

  useEffect(() => {
    const wrapper = document.querySelector('.platform-tabs-wrapper')
    if (!wrapper) return
    let sibling = wrapper.nextElementSibling
    while (sibling) {
      ;(sibling as HTMLElement).style.display =
        activeTab === 'web' ? '' : 'none'
      sibling = sibling.nextElementSibling
    }
  }, [activeTab])

  if (!mobile) return null

  const tabStyle = (tab: 'web' | 'mobile'): CSSProperties => ({
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--eds-typography-ui-body-font-family), sans-serif',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: activeTab === tab ? '#007079' : '#6F6F6F',
    borderBottom:
      activeTab === tab ? '2px solid #007079' : '2px solid transparent',
    marginBottom: '-2px',
  })

  return (
    <div className="platform-tabs-wrapper">
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #DCDCDC',
          marginBottom: '1.5rem',
        }}
      >
        <button onClick={() => setActiveTab('web')} style={tabStyle('web')}>
          React
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          style={tabStyle('mobile')}
        >
          React Native
        </button>
      </div>
      {activeTab === 'mobile' && <div>{mobile}</div>}
    </div>
  )
}
