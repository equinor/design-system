import React, { Fragment, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { Drawer, TopBar, Icon, DrawerProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  menu,
  business,
  meeting_room,
  cafe,
  world,
} from '@equinor/eds-icons'

const { DrawerList, DrawerItem, DrawerLabel } = Drawer
const { Header, CustomContent } = TopBar

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  menu,
  business,
  meeting_room,
  cafe,
  world,
}

Icon.add(icons)

type WrapperProps = { tabIndex?: string } & HTMLAttributes<HTMLDivElement>

const Wrapper = styled.div<WrapperProps>`
  display: grid;
  grid-template-columns: 256px auto;
  grid-template-rows: auto;
`

const Body = styled.div`
  height: 100%;
  min-height: 750px;
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
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: {
    DrawerLabel,
    DrawerItem,
    DrawerList,
  },
} as Meta

export const Default: Story<DrawerProps> = () => {
  return (
    <>
      <TopBar>
        <Header>
          {' '}
          <Icon name="menu" size={16} />
        </Header>
        <CustomContent>Drawer example</CustomContent>
      </TopBar>
      <Wrapper>
        <Drawer ariaLabel="Drawer Example">
          <DrawerItem>
            <DrawerList>
              <DrawerItem>Orphan (child) 1</DrawerItem>
              <DrawerItem>Orphan (child) 2</DrawerItem>
              <DrawerItem>Orphan (child) 3</DrawerItem>
            </DrawerList>
          </DrawerItem>
          <DrawerItem>
            <DrawerList label="With subtitle" subtitle="Subtitle">
              <DrawerItem>Sub Child 1</DrawerItem>
              <DrawerItem>Sub Child 2</DrawerItem>
              <DrawerItem>Sub Child 3</DrawerItem>
            </DrawerList>
          </DrawerItem>
          <DrawerItem>
            <DrawerList isExpandable label="With nesting" level="grandparent">
              <DrawerItem>
                <DrawerList isExpandable label="Inner list" level="parent">
                  <DrawerItem>Inner Child 1</DrawerItem>
                  <DrawerItem>Inner Child 2</DrawerItem>
                </DrawerList>
              </DrawerItem>
              <DrawerItem>Outer 1</DrawerItem>
            </DrawerList>
          </DrawerItem>
        </Drawer>
      </Wrapper>
    </>
  )
}
