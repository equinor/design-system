import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { SideSheet } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  margin: 32px;
`

const Child = styled.div`
  padding: 6px;
  background-color: rgba(255, 146, 0, 0.15);
  box-sizing: border-box;
  border: 1px dashed #ff9200;
  border-radius: 4px;
`

export default {
  title: 'Components|SideSheet',
  component: SideSheet,
}

export const AllSidesheets = () => (
  <Wrapper>
    <h2>X Large</h2>
    <Wrapper>
      <SideSheet size="xlarge" title="Title">
        <Child>Children</Child>
      </SideSheet>
    </Wrapper>
    <h2>Large</h2>
    <Wrapper>
      <SideSheet size="large" title="Title">
        <Child>Children</Child>
      </SideSheet>
    </Wrapper>
    <h2>Medium</h2>
    <Wrapper>
      <SideSheet size="medium" title="Title">
        <Child>Children</Child>
      </SideSheet>
    </Wrapper>
    <h2>Small</h2>
    <Wrapper>
      <SideSheet size="small" title="Title">
        <Child>Children</Child>
      </SideSheet>
    </Wrapper>
  </Wrapper>
)
