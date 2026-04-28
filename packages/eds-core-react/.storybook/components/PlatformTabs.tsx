import { useState, ReactNode, useEffect } from 'react'

type PlatformTabsProps = {
  mobile?: ReactNode
}

const getInitialTab = (): 'web' | 'mobile' => {
  if (typeof window === 'undefined') return 'web'
  try {
    const params = new URLSearchParams(window.parent.location.search)
    return params.get('platform') === 'mobile' ? 'mobile' : 'web'
  } catch {
    return 'web'
  }
}

export const PlatformTabs = ({ mobile }: PlatformTabsProps) => {
  const [activeTab, setActiveTab] = useState<'web' | 'mobile'>(getInitialTab)

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

  return (
    <div className="platform-tabs-wrapper">
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid #DCDCDC',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('web')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontFamily: 'Equinor, sans-serif',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'web' ? 500 : 400,
            color: activeTab === 'web' ? '#007079' : '#6F6F6F',
            borderBottom:
              activeTab === 'web'
                ? '2px solid #007079'
                : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          React
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontFamily: 'Equinor, sans-serif',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'mobile' ? 500 : 400,
            color: activeTab === 'mobile' ? '#007079' : '#6F6F6F',
            borderBottom:
              activeTab === 'mobile'
                ? '2px solid #007079'
                : '2px solid transparent',
            marginBottom: '-2px',
          }}
        >
          React Native
        </button>
      </div>
      {activeTab === 'mobile' && <div>{mobile}</div>}
    </div>
  )
}
