import React, { useState, Fragment } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {
  SideSheet,
  Typography,
  Button,
  TopBar,
  Icon,
} from '@equinor/eds-core-react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
} from '@equinor/eds-icons'

const { Actions, Header, CustomContent } = TopBar

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
}

Icon.add(icons)

const Wrapper = styled.div`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  position: relative;
  height: 1500px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  > * {
    margin-left: 40px;
  }
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
      <TopBar>
        <Header>
          <Fragment>
            <Icon name="grid_on" size={16} />
            Application name - subtitle
          </Fragment>
        </Header>
        <CustomContent></CustomContent>
        <Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="accessible" size={16} />
            <Icon name="notifications" size={16} />
            <Icon name="fullscreen" size={16} />
          </Icons>
        </Actions>
      </TopBar>

      <Body>
        <SideSheet
          variant="small"
          title="Small"
          open={toggle}
          topBarVisible={true}
          onClose={() => setToggle(!toggle)}
        >
          <Child variant="outlined">Children</Child>
        </SideSheet>
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
        variant="medium"
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
        variant="large"
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
        variant="xlarge"
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
