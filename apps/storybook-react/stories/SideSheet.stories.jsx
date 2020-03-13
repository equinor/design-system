import React from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { SideSheet, Typography } from '@equinor/eds-core-react'

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

export const Small = () => (
  <Wrapper>
    <SideSheet size="small" title="Small">
      <Child variant="outlined">Children</Child>
    </SideSheet>
    <Body>
      <p>Top of page</p>
      <p>Middle of page</p>
      <p>Bottom of page</p>
    </Body>
  </Wrapper>
)

export const Medium = () => (
  <Wrapper>
    <SideSheet size="medium" title="Medium">
      <Child variant="outlined">Children</Child>
    </SideSheet>
    <Body>
      <p>Top of page</p>
      <p>Middle of page</p>
      <p>Bottom of page</p>
    </Body>
  </Wrapper>
)

export const Large = () => (
  <Wrapper>
    <SideSheet size="large" title="Large">
      <Child variant="outlined">Children</Child>
    </SideSheet>
    <Body>
      <p>Top of page</p>
      <p>Middle of page</p>
      <p>Bottom of page</p>
    </Body>
  </Wrapper>
)

export const XLarge = () => (
  <Wrapper>
    <SideSheet size="xlarge" title="X Large">
      <Child variant="outlined">Children</Child>
    </SideSheet>
    <Body>
      <p>Top of page</p>
      <p>Middle of page</p>
      <p>Bottom of page</p>
    </Body>
  </Wrapper>
)
