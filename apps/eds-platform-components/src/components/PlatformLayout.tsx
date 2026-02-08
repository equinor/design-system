'use client'

import { TopBar, Tabs } from '@equinor/eds-core-react'
import { useState } from 'react'
// import Link from 'next/link'
import './platform-layout.css'

type Platform = 'power-platform' | 'power-bi' | 'pega' | 'sharepoint'

type PlatformLayoutProps = {
  children: React.ReactNode
  activePlatform?: Platform
}

export const PlatformLayout = ({
  children,
  activePlatform = 'power-platform',
}: PlatformLayoutProps) => {
  const [activeTab, setActiveTab] = useState(activePlatform)

  return (
    <div className="platform-layout">
      <TopBar className="platform-topbar">
        <TopBar.Header className="platform-header">
          <div className="platform-title">EDS Platform Components</div>
        </TopBar.Header>
        <TopBar.Actions className="platform-actions">
          <Tabs
            activeTab={activeTab}
            onChange={(value: string | number) => {
              const platforms: Platform[] = [
                'power-platform',
                'power-bi',
                'pega',
                'sharepoint',
              ]
              setActiveTab(platforms[value as number])
            }}
            variant="fullWidth"
          >
            <Tabs.List>
              <Tabs.Tab>PowerPlatform</Tabs.Tab>
              <Tabs.Tab disabled>Power BI</Tabs.Tab>
              <Tabs.Tab disabled>Pega</Tabs.Tab>
              <Tabs.Tab disabled>SharePoint</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </TopBar.Actions>
      </TopBar>
      <div className="platform-content">{children}</div>
    </div>
  )
}
