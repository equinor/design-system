'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { DataVizPanel } from '@/components/themebuilder/dataviz/DataVizPanel'

export default function DataVizPage() {
  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-neutral-subtle"
        style={{
          background: 'color-mix(in srgb, var(--background) 85%, transparent)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <h1 className="text-lg font-bold m-0 whitespace-nowrap">
            EDS Data Visualisation Palettes
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-subtle bg-default text-subtle hover:text-strong transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Theme builder
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-sm text-subtle mt-0 mb-6 max-w-3xl">
          Generate accessible colour palettes for charts and data
          visualisation: distinct categorical series, ordered sequential
          scales, and diverging scales around a midpoint. Everything is checked
          for colour-vision-deficiency safety and adapts to light and dark mode.
        </p>
        <DataVizPanel />
      </main>
    </div>
  )
}
