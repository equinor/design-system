/* eslint-disable import/no-default-export */
import React, { type ReactNode } from 'react'
// import SearchBar from '@theme-original/SearchBar'
import { Search as SearchBar } from '@equinor/eds-core-react'

export default function SearchBarWrapper(): ReactNode {
  return (
    <>
      <div className="search-bar">
        <SearchBar
          aria-label="sitewide"
          id="search-normal"
          placeholder="Search"
          // onChange={handleOnChange}
        />
      </div>
    </>
  )
}
