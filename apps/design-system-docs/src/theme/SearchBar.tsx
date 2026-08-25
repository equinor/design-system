import React, { type ReactNode } from 'react'
import SearchBar from '@theme-original/SearchBar'
import './docs-search-bar.css'

export default function SearchBarWrapper(): ReactNode {
  return (
    <div className="docs-search-bar">
      <SearchBar />
    </div>
  )
}
