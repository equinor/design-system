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
} from '@equinor/eds-icons'

const { DrawerContainer, DrawerList, DrawerItem, DrawerSubtitle } = Drawer
const { Actions, Header, CustomContent } = TopBar

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  menu,
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
          <Icon name="menu" size={16} />
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
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent 1
                </Typography>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent 2
                </Typography>
                <DrawerList level="parent">
                  <DrawerItem active>
                    <Typography variant="body_short" link href={'#href'}>
                      Parent 1 active
                    </Typography>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short" link href={'#href'}>
                      Parent 2
                    </Typography>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short" link href={'#href'}>
                      Parent 3
                    </Typography>
                  </DrawerItem>
                  <DrawerItem>
                    <Typography variant="body_short" link href={'#href'}>
                      Parent 4
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
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 3
                        </Typography>
                      </DrawerItem>
                      <DrawerItem>
                        <Typography variant="body_short" link href={'#href'}>
                          Child 4
                        </Typography>
                      </DrawerItem>
                    </DrawerList>
                  </DrawerItem>
                </DrawerList>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent 3
                </Typography>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent 4
                </Typography>
              </DrawerItem>
            </DrawerList>
            <DrawerSubtitle name="Grandparent orphans" />
            <DrawerList level="grandparent">
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent orphan 1
                </Typography>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent orphan 2
                </Typography>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent orphan 3
                </Typography>
              </DrawerItem>
              <DrawerItem>
                <Typography variant="body_short" link href={'#href'}>
                  Grandparent orphan 4
                </Typography>
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
