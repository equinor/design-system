'use client'

import { TopBar, Tabs } from '@equinor/eds-core-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './platform-layout.css'

type Platform = 'home' | 'power-platform' | 'power-bi' | 'pega' | 'sharepoint'

type PlatformLayoutProps = {
  children: React.ReactNode
  activePlatform?: Platform
  showTabs?: boolean
}

const platformRoutes: Record<Exclude<Platform, 'home'>, string> = {
  'power-platform': '/power-apps/buttons',
  'power-bi': '#',
  pega: '#',
  sharepoint: '#',
}

export const PlatformLayout = ({
  children,
  activePlatform = 'home',
  showTabs = true,
}: PlatformLayoutProps) => {
  const router = useRouter()

  const getActiveTabIndex = () => {
    if (activePlatform === 'home') return -1
    const platforms: Exclude<Platform, 'home'>[] = [
      'power-platform',
      'power-bi',
      'pega',
      'sharepoint',
    ]
    return platforms.indexOf(activePlatform as Exclude<Platform, 'home'>)
  }

  const handleTabChange = (value: string | number) => {
    const platforms: Exclude<Platform, 'home'>[] = [
      'power-platform',
      'power-bi',
      'pega',
      'sharepoint',
    ]
    const selectedPlatform = platforms[value as number]
    const route = platformRoutes[selectedPlatform]

    if (route !== '#') {
      router.push(route)
    }
  }

  return (
    <div className="platform-layout">
      <TopBar className="platform-topbar">
        <TopBar.Header className="platform-header">
          <Link href="/" className="platform-title-link">
            <div className="platform-title">EDS Platform Components</div>
          </Link>
        </TopBar.Header>
        {showTabs && (
          <TopBar.Actions className="platform-actions">
            <Tabs
              activeTab={getActiveTabIndex()}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tabs.List>
                <Tabs.Tab>Power Platform</Tabs.Tab>
                <Tabs.Tab disabled>Power BI</Tabs.Tab>
                <Tabs.Tab disabled>Pega</Tabs.Tab>
                <Tabs.Tab disabled>SharePoint</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </TopBar.Actions>
        )}
      </TopBar>
      <div className="platform-content">{children}</div>
    </div>
  )
}
