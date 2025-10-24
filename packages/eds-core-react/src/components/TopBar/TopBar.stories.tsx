import styled from 'styled-components'
import { TopBar, Icon, Search, TopbarProps, Typography } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'

import {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  apps,
} from '@equinor/eds-icons'

import type { JSX } from 'react'

const meta: Meta<typeof TopBar> = {
  title: 'Navigation/TopBar',
  component: TopBar,
  subcomponents: {
    Header: TopBar.Header,
    CustomContent: TopBar.CustomContent,
    Actions: TopBar.Actions,
  },
  parameters: {
    docs: {},
  },
}

export default meta

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
  apps,
}

Icon.add(icons)

const Wrapper = styled.div.attrs({ tabIndex: 0 })`
  height: 65vh;
  overflow: auto;
`

const BodyWrapper = styled.div`
  height: 1000px;
  background: #ebebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`

export const Introduction: StoryFn<TopbarProps> = (props): JSX.Element => {
  return (
    <Wrapper>
      <TopBar {...props}>
        <TopBar.Header>
          <>
            <Icon name="apps" />
            Application name - subtitle
          </>
        </TopBar.Header>
      </TopBar>
      <BodyWrapper>
        <Typography group="input" variant="text">
          Top of page
        </Typography>
        <Typography group="input" variant="text">
          Middle of page
        </Typography>
        <Typography group="input" variant="text">
          Bottom of page
        </Typography>
      </BodyWrapper>
    </Wrapper>
  )
}

export const WithSearchAndIcons: StoryFn<TopbarProps> = (): JSX.Element => {
  const Icons = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > * {
      margin-left: 40px;
    }
  `

  return (
    <TopBar>
      <TopBar.Header>
        <Icon name="apps" />
        Application name - subtitle
      </TopBar.Header>
      <TopBar.CustomContent>
        <Search aria-label="sitewide" id="search-normal" placeholder="Search" />
      </TopBar.CustomContent>
      <TopBar.Actions>
        <Icons>
          <Icon name="account_circle" size={16} title="user" />
          <Icon name="accessible" size={16} />
          <Icon name="notifications" size={16} />
          <Icon name="fullscreen" size={16} />
        </Icons>
      </TopBar.Actions>
    </TopBar>
  )
}
WithSearchAndIcons.storyName = 'With search and icons'

/* export const Compact: Story<TopbarProps> = (): JSX.Element => {
  const Icons = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > * {
      margin-left: 40px;
    }
  `
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <TopBar>
        <TopBar.Header>
          <Icon name="apps" />
          Application name - subtitle
        </TopBar.Header>
        <TopBar.CustomContent>
          <Search
            aria-label="sitewide"
            id="search-normal"
            placeholder="Search"
          />
        </TopBar.CustomContent>
        <TopBar.Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="accessible" size={16} />
            <Icon name="notifications" size={16} />
            <Icon name="fullscreen" size={16} />
          </Icons>
        </TopBar.Actions>
      </TopBar>
    </EdsProvider>
  )
} */
