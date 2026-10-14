'use client'

import { AppHeader } from '@/components/shared/AppHeader'
import { Main } from '@/components/shared/Main'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-primary">
      <AppHeader />

      <Main className="max-w-6xl mx-auto py-8">
        <h1 className="m-0 text-header-2xl font-medium">
          EDS Colour Palette Generator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-secondary">
          The Theme Builder is added in the next pull request in this stack.
        </p>
      </Main>
    </div>
  )
}
