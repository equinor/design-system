import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Search } from '@equinor/eds-core-react'

const DocSearchContainer = styled.div`
  input {
    width: 100%;
  }
`

const SrLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`
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
    <DocSearchContainer>
      {process.env.GATSBY_STAGE === 'dev' && (
        <>
          <Search
            aria-label="sitewide search"
            id="search"
            placeholder="Search"
          />
          {/*  <label htmlFor="search">
            <SrLabel>Sitewide search</SrLabel>
            <input
              type="search"
              className={`docsearch-input-${name}`}
              id="search2"
              placeholder="search"
            />
          </label> */}
        </>
      )}
    </DocSearchContainer>
  )
}
