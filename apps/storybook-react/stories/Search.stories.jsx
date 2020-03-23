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
const handleFormSubmit = action('onSubmit')

export const Examples = () => (
  <div>
    <Wrapper>
      <Typography variant="h4">Normal</Typography>
      <Search
        aria-label="sitewide"
        id="search-normal"
        placeholder="Search"
        onChange={handleOnChange}
      ></Search>
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Centered & styled inside a container</Typography>
      <OuterContainer>
        <StyledSearch
          aria-label="container wide"
          id="search-contained"
          placeholder="Search"
          onChange={handleOnChange}
        ></StyledSearch>
      </OuterContainer>
    </Wrapper>
    <Wrapper>
      <Typography variant="h4">Inside form</Typography>
      <form action="/">
        <Search placeholder="Search"></Search>
      </form>
    </Wrapper>
  </div>
)
