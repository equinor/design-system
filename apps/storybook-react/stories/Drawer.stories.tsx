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
  DrawerContainer,
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
    DrawerContainer,
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
          <DrawerContainer>
            <DrawerList level="grandparent">
              <DrawerItem>
                <DrawerLabel>Grandparent 1</DrawerLabel>
                <DrawerList level="parent">
                  <DrawerItem>
                    <DrawerLabel>Parent 1</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <DrawerLabel>Parent 2</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                </DrawerList>
              </DrawerItem>
              <DrawerItem>
                <DrawerLabel>Grandparent 2</DrawerLabel>
                <DrawerList level="parent" open>
                  <DrawerItem>
                    <DrawerLabel>Parent 1</DrawerLabel>
                    <DrawerList open>
                      <DrawerItem active>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1 active
                        </Typography>
                      </DrawerItem>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 2
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <DrawerLabel>Parent 2</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <DrawerLabel>Parent 3</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <DrawerLabel>Parent 4</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 2
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                </DrawerList>
              </DrawerItem>
              <DrawerItem>
                <DrawerLabel
                  variant="body_short"
                  title="Grandparent with a really long name 3"
                >
                  Grandparent with a really long name 3
                </DrawerLabel>
                <DrawerList level="parent">
                  <DrawerItem>
                    <DrawerLabel>Parent 1</DrawerLabel>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                </DrawerList>
              </DrawerItem>
            </DrawerList>
            <DrawerSubtitle name="Grandparent orphans" />
            <DrawerList level="grandparent">
              <DrawerItem>
                <DrawerLabel>Grandparent orphans 1</DrawerLabel>
                <DrawerList>
                  <DrawerItem>
                    <Typography variant="body_short" link href={'#href'}>
                      Child 1
                    </Typography>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short" link href={'#href'}>
                      Child 2
                    </Typography>
                  </DrawerItem>
                </DrawerList>
              </DrawerItem>
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
