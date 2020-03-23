import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Search, Typography } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
  width: 90%;
`

const OuterContainer = styled.div`
  background: lightblue;
  padding: 8px;
  width: 400px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledSearch = styled(Search)`
  width: 80%;
`

export default {
  title: 'Components|Search',
  component: Search,
  decorators: [withKnobs],
}

const handleOnChange = action('onChange')

export const Examples = () => (
  <div>
    <Wrapper>
      <Typography variant="h4">Normal</Typography>
      <Search
        aria-label="sitewide"
        id="search-normal"
        placeholder="Search"
        onChange={handleOnChange}
      />
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Predefined</Typography>
      <Search
        aria-label="predefined"
        id="search-predefined"
        placeholder="Search"
        onChange={handleOnChange}
        value="Predefined value"
      />
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Centered & styled inside a container</Typography>
      <OuterContainer>
        <StyledSearch
          aria-label="contained"
          id="search-contained"
          placeholder="Search"
          onChange={handleOnChange}
        />
      </OuterContainer>
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Inside form</Typography>
      <form action="/">
        <Search placeholder="Search" />
      </form>
    </Wrapper>
  </div>
)
