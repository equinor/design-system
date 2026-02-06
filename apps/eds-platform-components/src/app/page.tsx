'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PlatformCard } from '@/components/PlatformCard'

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')

  const platforms = [
    {
      id: 'power-platform',
      title: 'Power Platform',
      description: 'Components optimized for Power Apps',
      href: '/power-apps/buttons',
    },
    {
      id: 'power-bi',
      title: 'Power BI',
      description: 'Custom visuals for Power BI reports',
      href: null,
    },
    {
      id: 'low-code',
      title: 'Low-Code Platforms',
      description: 'Components for various low-code solutions',
      href: null,
    },
  ]

  return (
    <div className="container">
      <header className="header">
        <h1>EDS Platform Components</h1>
        <p className="subtitle">
          Equinor Design System components for unconventional platforms and
          frameworks
        </p>
      </header>

      <main className="main">
        <section className="platform-selector">
          <h2>Select Platform</h2>
          <div className="platform-grid">
            {platforms.map((platform) =>
              platform.href ? (
                <Link
                  key={platform.id}
                  href={platform.href}
                  style={{ textDecoration: 'none' }}
                >
                  <PlatformCard
                    title={platform.title}
                    description={platform.description}
                    isActive={selectedPlatform === platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                  />
                </Link>
              ) : (
                <PlatformCard
                  key={platform.id}
                  title={platform.title}
                  description={platform.description}
                  isActive={selectedPlatform === platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                />
              ),
            )}
          </div>
        </section>

        {selectedPlatform && (
          <section className="components-section">
            <h2>Available Components</h2>
            <div className="info-box">
              <p>
                Components for <strong>{selectedPlatform}</strong> will be
                displayed here.
              </p>
              <p className="coming-soon">Coming soon...</p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
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
  )
}
