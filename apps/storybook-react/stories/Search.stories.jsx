import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Search, Typography } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
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

export const Examples = () => (
  <div>
    <Wrapper>
      <Typography variant="h4">Normal</Typography>
      <Search
        aria-label="sitewide"
        id="search-normal"
        placeholder="Search"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Predefined value</Typography>
      <Search
        aria-label="predefined"
        id="search-predefined"
        placeholder="Search"
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        value="Predefined value"
      />
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Centered & styled inside a container</Typography>
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
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Inside form</Typography>
      <form action="/">
        <Search placeholder="Search" onChange={handleOnChange} />
      </form>
    </Wrapper>
    <Wrapper>
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
    </Wrapper>
  </div>
)
