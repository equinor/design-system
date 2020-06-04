import React, { useState } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Search, Typography, Button } from '@equinor/eds-core-react'

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
  title: 'Components|Search',
  component: Search,
  decorators: [withKnobs],
}

const handleOnChange = action('onChange')
const handleOnBlur = action('onBlur')
const handleOnFocus = action('onFocus')

export const Examples = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleOnSearchValueChange = (event) => {
    const value = event.target.value
    handleOnChange()
    setSearchValue(value)
  }

  return (
    <div>
      <Rows>
        <Typography variant="h4">Normal</Typography>
        <Search
          aria-label="sitewide"
          id="search-normal"
          placeholder="Search"
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </Rows>
      <Rows>
        <Typography variant="h4">Predefined value</Typography>
        <Search
          aria-label="predefined"
          id="search-predefined"
          placeholder="Search"
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          defaultValue="Predefined value"
        />
      </Rows>
      <Rows>
        <Typography variant="h4">
          Centered & styled inside a container
        </Typography>
        <OuterContainer>
          50% width
          <StyledSearch
            aria-label="contained"
            id="search-contained"
            placeholder="Search"
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </OuterContainer>
      </Rows>
      <Rows>
        <Typography variant="h4">Inside form</Typography>
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
        <Typography variant="h4">Set value using hooks</Typography>
        <Columns>
          <Search
            aria-label="external set value"
            id="search-external"
            placeholder="Say hello! 🙋"
            onChange={handleOnSearchValueChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
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
    </div>
  )
}
