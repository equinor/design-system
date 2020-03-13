import React, { useState } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { SideSheet, Typography, Button } from '@equinor/eds-core-react'

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

export function Small() {
  const [toggle, setToggle] = useState(true)

  return (
    <Wrapper>
      <SideSheet
        size="small"
        title="Small"
        open={toggle}
        onClose={() => setToggle(!toggle)}
      >
        <Child variant="outlined">Children</Child>
      </SideSheet>
      <Body>
        <div>
          <p>Top of page</p>
          <Button variant="outlined" onClick={() => setToggle(!toggle)}>
            Toggle Sidesheet
          </Button>
        </div>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}

export function Medium() {
  const [toggle, setToggle] = useState(true)

  return (
    <Wrapper>
      <SideSheet
        size="medium"
        title="Medium"
        open={toggle}
        onClose={() => setToggle(!toggle)}
      >
        <Child variant="outlined">Children</Child>
      </SideSheet>
      <Body>
        <div>
          <p>Top of page</p>
          <Button variant="outlined" onClick={() => setToggle(!toggle)}>
            Toggle Sidesheet
          </Button>
        </div>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}

export function Large() {
  const [toggle, setToggle] = useState(true)

  return (
    <Wrapper>
      <SideSheet
        size="large"
        title="Large"
        open={toggle}
        onClose={() => setToggle(!toggle)}
      >
        <Child variant="outlined">Children</Child>
      </SideSheet>
      <Body>
        <div>
          <p>Top of page</p>
          <Button variant="outlined" onClick={() => setToggle(!toggle)}>
            Toggle Sidesheet
          </Button>
        </div>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}

export function XLarge() {
  const [toggle, setToggle] = useState(true)

  return (
    <Wrapper>
      <SideSheet
        size="xlarge"
        title="X Large"
        open={toggle}
        onClose={() => setToggle(!toggle)}
      >
        <Child variant="outlined">Children</Child>
      </SideSheet>
      <Body>
        <div>
          <p>Top of page</p>
          <Button variant="outlined" onClick={() => setToggle(!toggle)}>
            Toggle Sidesheet
          </Button>
        </div>
        <p>Middle of page</p>
        <p>Bottom of page</p>
      </Body>
    </Wrapper>
  )
}
