import React, { Fragment } from 'react'
// import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Drawer, TopBar, Icon } from '@equinor/eds-core-react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  grid_on,
} from '@equinor/eds-icons'

const { DrawerContainer, DrawerList, DrawerItem, DrawerSubtitle } = Drawer
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
  /* height: 100vh;
  overflow: auto; */
  display: grid;
  grid-template-columns: 256px auto;
  grid-template-rows: auto;
`

const Body = styled.div`
  height: 750px;
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

export default {
  title: 'Components|Drawer',
  component: Drawer,
}

export const Page = () => {
  return (
    <Fragment>
      <TopBar>
        <Header>
          {' '}
          <Icon name="grid_on" size={16} />
        </Header>
        <CustomContent>Drawer example</CustomContent>
        <Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="accessible" size={16} />
            <Icon name="notifications" size={16} />
            <Icon name="fullscreen" size={16} />
          </Icons>
        </Actions>
      </TopBar>
      <Wrapper tabIndex="0">
        <Drawer>
          <DrawerContainer>
            <DrawerList level="grandparent">
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerList level="parent">
                <DrawerItem href="#">Label</DrawerItem>
                <DrawerItem href="#">Label</DrawerItem>
                <DrawerItem href="#">Label</DrawerItem>
                <DrawerItem href="#">Label</DrawerItem>
              </DrawerList>
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerItem href="#">Label</DrawerItem>
            </DrawerList>
            <DrawerList level="grandparent">
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerItem href="#">Label</DrawerItem>
              <DrawerItem href="#">Label</DrawerItem>
            </DrawerList>
          </DrawerContainer>
        </Drawer>
        <Body>
          <p>Top of page</p>
          <p>Middle of page</p>
          <p>Bottom of page</p>
        </Body>
      </Wrapper>
    </Fragment>
  )
}
