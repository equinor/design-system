'use client'

import Link from 'next/link'
import { PlatformLayout } from '@/components/PlatformLayout'

export default function Home() {
  return (
    <PlatformLayout activePlatform="home">
      <div className="home-container">
        <header className="home-header">
          <h1>EDS Platform Components</h1>
          <p className="home-subtitle">
            Equinor Design System components for unconventional platforms and
            frameworks
          </p>
        </header>

        <main className="home-main">
          <section className="home-welcome">
            <h2>Welcome</h2>
            <div className="info-box">
              <p>
                Use the navigation tabs above to browse components optimized for
                different platforms. Currently, only{' '}
                <Link href="/power-apps/buttons">Power Platform</Link> is
                implemented with ready-to-use button components for Power Apps.
              </p>
              <p>
                Additional platforms like Power BI, Pega, and SharePoint are
                planned. We welcome suggestions for other platforms that would
                benefit from EDS component implementations.
              </p>
            </div>
          </section>

          <section className="components-section">
            <h2>What You&apos;ll Find Here</h2>
            <div className="info-box">
              <ul className="features-list">
                <li>
                  <strong>Platform-optimized components</strong> - Pre-configured
                  for specific environments
                </li>
                <li>
                  <strong>Copy-paste ready</strong> - YAML snippets and code you
                  can use immediately
                </li>
                <li>
                  <strong>EDS design tokens</strong> - Consistent with the Equinor
                  Design System
                </li>
                <li>
                  <strong>Accessibility-focused</strong> - Following WCAG 2.1 AA
                  standards
                </li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="home-footer">
          <p>
            Part of the{' '}
            <a
              href="https://eds.equinor.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Equinor Design System
            </a>
          </p>
        </footer>
      </div>
    </PlatformLayout>
  )
}
