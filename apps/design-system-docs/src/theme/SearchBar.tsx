import React, { type ReactNode } from 'react'
// import SearchBar from '@theme-original/SearchBar'
import { Search as SearchBar } from '@equinor/eds-core-react'

import type SearchBarType from '@theme/SearchBar'
import type { WrapperProps } from '@docusaurus/types'

type Props = WrapperProps<typeof SearchBarType>

export default function SearchBarWrapper(props: Props): ReactNode {
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
