'use client'

import { useState, useCallback } from 'react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Link2, Check } from 'lucide-react'

type Tab = 'fargesystem' | 'eksempler' | 'kontrast'

type ThemeBuilderHeaderProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function ThemeBuilderHeader({
  activeTab,
  onTabChange,
}: ThemeBuilderHeaderProps) {
  const [copied, setCopied] = useState(false)

  const copyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }, [])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'fargesystem', label: 'Fargesystem' },
    { key: 'eksempler', label: 'Eksempler' },
    { key: 'kontrast', label: 'Kontrast' },
  ]

  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-xl border-b border-neutral-subtle"
      style={{
        background: 'color-mix(in srgb, var(--background) 85%, transparent)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        <h1 className="text-lg font-bold m-0 whitespace-nowrap">
          EDS Theme Builder
        </h1>

        {/* Tab buttons */}
        <div className="flex rounded-lg overflow-hidden ml-4 border border-neutral-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={[
                'cursor-pointer px-4 py-1.5 text-sm border-none',
                tab.key !== 'fargesystem' ? 'border-l border-neutral-subtle' : '',
                activeTab === tab.key
                  ? 'bg-neutral-fill-emphasis-default text-strong-on-emphasis font-semibold'
                  : 'bg-default text-subtle font-normal',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={copyURL}
            className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-subtle bg-default text-subtle hover:text-strong transition-colors"
            title="Copy shareable URL"
            style={copied ? { color: '#16a34a' } : undefined}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
