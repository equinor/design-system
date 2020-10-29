import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import {
  Search,
  Typography,
  Button,
  SearchProps,
} from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

const Rows = styled.div`
  margin: 32px;
`

const Columns = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`

const OuterContainer = styled.div`
  background: lightblue;
  padding: 8px;
  width: 50%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledSearch = styled(Search)`
  width: 50%;
  margin-left: 32px;
`

export default {
  title: 'Components/Search',
} as Meta

const handleOnChange = action('onChange')
const handleOnBlur = action('onBlur')
const handleOnFocus = action('onFocus')

export const Examples: Story<SearchProps> = () => {
  const [searchValue, setSearchValue] = useState('Initial value')
  const [isFocused, setIsFocused] = useState(false)

  const handleOnSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value
    handleOnChange()
    setSearchValue(value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    handleOnFocus()
  }

  const handleBlur = () => {
    setIsFocused(false)
    handleOnBlur()
  }

  return (
    <>
      <Rows>
        <Typography variant="h4" as="h2">
          Normal
        </Typography>
        <Search
          aria-label="sitewide"
          id="search-normal"
          placeholder="Search"
          onChange={handleOnChange}
        />
      </Rows>
      <Rows
        style={{
          background: isFocused ? 'cyan' : 'transparent',
        }}
      >
        <Typography variant="h4" as="h2">
          Normal with onFocus & onBlur
        </Typography>
        <Search
          aria-label="focusedAndNot"
          id="search-focusedAndNot"
          placeholder="Search"
          onChange={handleOnChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Rows>
      <Rows>
        <Typography variant="h4" as="h2">
          Predefined value
        </Typography>
        <Search
          aria-label="predefined"
          id="search-predefined"
          placeholder="Search"
          onChange={handleOnChange}
          defaultValue="Predefined value"
        />
      </Rows>
      <Rows>
        <Typography variant="h4" as="h2">
          Centered & styled inside a container
        </Typography>
        <OuterContainer>
          50% width
          <StyledSearch
            aria-label="contained"
            id="search-contained"
            placeholder="Search"
            onChange={handleOnChange}
          />
        </OuterContainer>
      </Rows>
      <Rows>
        <Typography variant="h4" as="h2">
          Inside form
        </Typography>
        <form action="/">
          <Search placeholder="Search" onChange={handleOnChange} />
        </form>
      </Rows>
      <Rows>
        <Typography variant="h4">Disabled</Typography>
        <Search
          aria-label="disabled"
          id="search-disabled"
          placeholder="Search"
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          disabled
        />
      </Rows>
      <Rows>
        <Typography variant="h4" as="h2">
          Controlled input
        </Typography>
        <Typography variant="body_short">Value: {searchValue}</Typography>
        <Columns>
          <Search
            aria-label="external set value"
            id="search-external"
            placeholder="Say hello! 🙋"
            onChange={handleOnSearchValueChange}
            value={searchValue}
          />
          <Button
            onClick={() => {
              setSearchValue('Hello search! 👋')
              action('Set search value')()
            }}
          >
            Say hello to search!
          </Button>
        </Columns>
      </Rows>
    </>
  )
}
