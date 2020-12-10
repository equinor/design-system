import React, { Fragment, HTMLAttributes } from 'react'
import styled from 'styled-components'
import {
  Drawer,
  TopBar,
  Icon,
  Typography,
  DrawerProps,
} from '@equinor/eds-core-react'
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

const {
  DrawerList,
  // DrawerTreeItem,
  DrawerItem,
  DrawerSubtitle,
  DrawerLabel,
} = Drawer
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
    DrawerSubtitle,
    DrawerItem,
    DrawerList,
  },
} as Meta

export const Default: Story<DrawerProps> = () => {
  return (
    <Fragment>
      <TopBar>
        <Header>
          {' '}
          <Icon name="menu" size={16} />
        </Header>
        <CustomContent>Drawer example</CustomContent>
      </TopBar>
      <Wrapper>
        <Drawer>
          <DrawerList level="grandparent">
            <DrawerItem>
              <DrawerLabel>Grandparent 1</DrawerLabel>
              <DrawerList level="parent">
                <DrawerItem>
                  <DrawerLabel>Parent 1</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
                <DrawerItem>
                  <DrawerLabel>Parent 2</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
              </DrawerList>
            </DrawerItem>
            <DrawerItem>
              <DrawerLabel>Grandparent 2</DrawerLabel>
              <DrawerList level="parent">
                <DrawerItem>
                  <DrawerLabel>Parent 1</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 2
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
                <DrawerItem>
                  <DrawerLabel>Parent 2</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
                <DrawerItem>
                  <DrawerLabel>Parent 3</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
                <DrawerItem>
                  <DrawerLabel>Parent 4</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 2
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
              </DrawerList>
            </DrawerItem>
            <DrawerItem>
              <DrawerLabel>Grandparent with a really long name 3</DrawerLabel>
              <DrawerList level="parent">
                <DrawerItem>
                  <DrawerLabel>Parent 1</DrawerLabel>
                  <DrawerList>
                    <DrawerItem>
                      <Typography
                        variant="body_short"
                        role="menuitem"
                        link
                        href={'#href'}
                      >
                        Child 1
                      </Typography>
                    </DrawerItem>
                  </DrawerList>
                </DrawerItem>
              </DrawerList>
            </DrawerItem>
          </DrawerList>
          <DrawerList subtitle="Grandparent orphans">
            <DrawerItem>
              <Typography
                variant="body_short"
                role="menuitem"
                link
                href={'#href'}
              >
                Orphan 1
              </Typography>
            </DrawerItem>
            <DrawerItem>
              <Typography
                variant="body_short"
                role="menuitem"
                link
                href={'#href'}
              >
                Orphan 2
              </Typography>
            </DrawerItem>
          </DrawerList>
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

export const GroupList = <div></div>

export const NewDesign: Story<DrawerProps> = () => {
  return (
    <Drawer>
      <DrawerList label="Orphans">
        <DrawerItem>Orpahn (child) 1</DrawerItem>
        <DrawerItem>Orpahn (child) 2</DrawerItem>
        <DrawerItem>Orpahn (child) 3</DrawerItem>
      </DrawerList>
      <DrawerList isExpandable label="With nesting">
        <DrawerItem>
          <DrawerList isExpandable label="Inner list">
            <DrawerItem>Child 1</DrawerItem>
            <DrawerItem>Child 2</DrawerItem>
          </DrawerList>
        </DrawerItem>
        <DrawerItem>Child 1</DrawerItem>
      </DrawerList>
      <DrawerList label="With subtitle" subtitle="Subtitle">
        <DrawerItem>Child 1</DrawerItem>
        <DrawerItem>Child 2</DrawerItem>
        <DrawerItem>Child 3</DrawerItem>
      </DrawerList>
    </Drawer>
  )
}
