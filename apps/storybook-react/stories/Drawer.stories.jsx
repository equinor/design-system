import React, { Fragment } from 'react'
// import { withKnobs, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import { Drawer, TopBar, Icon, Typography } from '@equinor/eds-core-react'

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
  DrawerTreeItem,
  DrawerItem,
  DrawerSubtitle,
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

const Wrapper = styled.div`
  /* height: 100vh;
  overflow: auto; */
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
  title: 'Components|Drawer',
  component: Drawer,
}

const menu_items = []

export const Page = () => {
  return (
    <Fragment>
      <TopBar>
        <Header>
          {' '}
          <Icon name="menu" size={16} />
        </Header>
        <CustomContent>Drawer example</CustomContent>
      </TopBar>
      <Wrapper tabIndex="0">
        <Drawer>
          <DrawerContainer>
            <DrawerList level="grandparent">
              <DrawerItem>
                <Icon name="account_circle" size={16} />
                <Typography variant="body_short">Grandparent 1</Typography>
                <DrawerList level="parent">
                  <DrawerItem>
                    <Typography variant="body_short">Parent 1</Typography>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short">Parent 2</Typography>
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
                <Icon name="accessible" size={16} />
                <Typography variant="body_short">Grandparent 2</Typography>
                <DrawerList level="parent" open>
                  <DrawerItem>
                    <Typography variant="body_short">Parent 1</Typography>
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
                    <Typography variant="body_short">Parent 2</Typography>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short">Parent 3</Typography>
                    <DrawerList>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 1
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short">Parent 4</Typography>
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
                <Icon name="notifications" size={16} />
                <Typography
                  variant="body_short"
                  title="Grandparent with a really long name 3"
                >
                  Grandparent with a really long name 3
                </Typography>
                <DrawerList level="parent">
                  <DrawerItem>
                    <Typography variant="body_short">Parent 1</Typography>
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
                <Icon name="business" size={16} />
                <Typography variant="body_short">
                  Grandparent orphans 1
                </Typography>
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
