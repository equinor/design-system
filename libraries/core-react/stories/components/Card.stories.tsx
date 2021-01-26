import React from 'react'
import styled from 'styled-components'
import { Card, Avatar, Typography, Button, Icon, CardProps } from '@components'
import { more_vertical, share, person_add, settings } from '@equinor/eds-icons'
import { Meta, Story } from '@storybook/react'

const icons = {
  more_vertical,
  share,
  person_add,
  settings,
}

Icon.add(icons)

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  background: #ebebeb;
`
const { Header, HeaderTitle, Media, Actions } = Card

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `A card displays content related to a single subject and 
        acts as an entry point to more detailed information. Card blocks can be 
        combined in a variety of ways.
        `,
      },
    },
  },
  subcomponents: { Header, HeaderTitle, Media, Actions },
} as Meta

export const Default: Story<CardProps> = (args) => (
  <Wrapper>
    <Card {...args}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">An interactive example</Typography>
          <Typography variant="body_short">With some short content.</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card {...args}>
      <Card.Media fullWidth>
        <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
      </Card.Media>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Another interactive example</Typography>
          <Typography variant="body_short">
            Unfortunately you cannot control children in storybook yet
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Typography variant="body_short">
        Leading images are full width, and go straight to the top - ignoring
        spacings
      </Typography>
    </Card>
  </Wrapper>
)

export const TypeOfCards: Story<CardProps> = () => (
  <Wrapper>
    <Card>
      <Card.Header>
        <Typography variant="h5">Default</Typography>
      </Card.Header>
    </Card>
    <Card variant="info">
      <Card.Header>
        <Typography variant="h5">Info</Typography>
      </Card.Header>
    </Card>
    <Card variant="warning">
      <Card.Header>
        <Typography variant="h5">Warning</Typography>
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <Typography variant="h5">Danger</Typography>
      </Card.Header>
    </Card>
  </Wrapper>
)
TypeOfCards.storyName = 'Type variants'

export const CardHeaderVariants: Story<CardProps> = () => (
  <Wrapper>
    <Card variant="info">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </Card.Header>
    </Card>
    <Card variant="info">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </HeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">Caption</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h6">Title goes here</Typography>
          <Typography variant="body_short">Caption</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </Card.Header>
    </Card>

    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={48}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
  </Wrapper>
)
CardHeaderVariants.storyName = 'Header variants'

export const WithMedia: Story<CardProps> = () => {
  const CardMediafullWidth = () => (
    <Card.Media fullWidth>
      <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
    </Card.Media>
  )
  return (
    <Wrapper>
      <Card>
        <CardMediafullWidth />
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">Full width</Typography>
            <Typography variant="body_short">
              Full width as leading block
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Typography variant="body_short">
          Leading images are full width, and go straight to the top - ignoring
          spacings
        </Typography>
      </Card>
      <Card>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">Full width</Typography>
            <Typography variant="body_short">
              Full width as last block
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Typography variant="body_short">
          Last blocks with fullWidth ignores left and right spacings but keep
          24px bottom spacing
        </Typography>
        <CardMediafullWidth />
      </Card>
      <Card>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">Middle</Typography>
            <Typography variant="body_short">
              To be used between blocks
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Media>
          <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        </Card.Media>
        <Typography variant="body_short">
          Default spacing is 16px between middle blocks
        </Typography>
      </Card>
    </Wrapper>
  )
}
WithMedia.storyName = 'With media'

export const WithActions: Story<CardProps> = () => (
  <Wrapper>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Default</Typography>
          <Typography variant="body_short">Left aligned buttons</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Typography variant="body_short">
        Action elements are aligned left in this example
      </Typography>

      <Card.Actions>
        <Button>Cancel</Button>
        <Button>OK</Button>
      </Card.Actions>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Right</Typography>
          <Typography variant="body_short">Right aligned buttons</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Typography variant="body_short">
        Action elements are aligned right in this example
      </Typography>
      <Card.Actions alignRight>
        <Button variant="ghost_icon">
          <Icon name="person_add" title="add person action" size={48}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="settings" title="settings action" size={48}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="save" title="save action" size={48}></Icon>
        </Button>
      </Card.Actions>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Meta</Typography>
          <Typography variant="body_short">
            Use as supporting text for icons
          </Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Typography variant="body_short">
        Action elements with metadata
      </Typography>
      <Card.Actions meta="Share">
        <Button variant="ghost_icon">
          <Icon name="share" title="share action" size={48}></Icon>
        </Button>
      </Card.Actions>
    </Card>
  </Wrapper>
)

WithActions.storyName = 'With actions'
