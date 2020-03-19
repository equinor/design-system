import React from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Search } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(5, fit-content(100%));
`

export default {
  title: 'Components|Search',
  component: Search,
  decorators: [withKnobs],
}

export const IconExamples = () => (
  <div>
    <Wrapper>
      <Search placeholder="Search"></Search>
    </Wrapper>
  </div>
)
