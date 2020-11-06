import React, { useEffect } from 'react'
import { Search } from '@equinor/eds-core-react/dist/core-react.cjs.js'

const isSSR = typeof window === 'undefined'

export const DocSearch = () => {
  const name = 'search'
  useEffect(() => {
    if (isSSR) return

    window.docsearch({
      apiKey: '73fc0edd06a8031c699edfc560eaa013',
      indexName: 'equinor_design-system',
      // We need a *unique* id here. Breaks if we use memoized ids if we also
      // try to use SSR, so instead we use an explicit name prop:
      inputSelector: `#search`,
    })
  }, [name])
  return (
    <Search aria-label="sitewide search" id="search" placeholder="Search" />
  )
}
