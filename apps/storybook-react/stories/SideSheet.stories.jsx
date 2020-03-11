import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { SideSheet } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
`

export default {
  title: 'Components|SideSheet',
  component: SideSheet,
}

export const AllSidesheets = () => (
  <Wrapper>
    <h2>X Large</h2>
    <Wrapper>
      <SideSheet size="xlarge" title="Title" />
    </Wrapper>
    <h2>Large</h2>
    <Wrapper>
      <SideSheet size="large" title="Title" />
    </Wrapper>
    <h2>Medium</h2>
    <Wrapper>
      <SideSheet size="medium" title="Title" />
    </Wrapper>
    <h2>Small</h2>
    <Wrapper>
      <SideSheet size="small" title="Title" />
    </Wrapper>
  </Wrapper>
)
