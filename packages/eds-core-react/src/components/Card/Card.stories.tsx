import styled from 'styled-components'
import {
  Avatar,
  Button,
  Card,
  CardProps,
  Chip,
  Divider,
  Icon,
  Typography,
} from '../..'
import { more_vertical, share, person_add, settings } from '@equinor/eds-icons'
import { ComponentMeta, Story } from '@storybook/react'
import page from './Card.docs.mdx'

const icons = {
  more_vertical,
  share,
  person_add,
  settings,
}

Icon.add(icons)

const iconSize = 24

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

export default {
  title: 'Surfaces/Card',
  component: Card,
  parameters: {
    docs: {
      page,
    },
  },
  subcomponents: {
    Header: Card.Header,
    HeaderTitle: Card.HeaderTitle,
    Content: Card.Content,
    Media: Card.Media,
    Actions: Card.Actions,
  },
} as ComponentMeta<typeof Card>

export const Introduction: Story<CardProps> = (args) => (
  <Wrapper>
    <Card {...args}>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">An interactive example</Typography>
          <Typography variant="body_short">With some short content.</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={iconSize}></Icon>
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
      <Card.Content>
        <Typography variant="body_short">
          Leading images are full width, and go straight to the top - ignoring
          spacings
        </Typography>
      </Card.Content>
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
TypeOfCards.storyName = 'Container variants'

export const CardHeaderVariants: Story<CardProps> = () => (
  <Wrapper>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
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
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </Card.Header>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={iconSize}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card variant="info">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="body_short">Body short</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={iconSize}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card variant="warning">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="caption">Caption</Typography>
        </Card.HeaderTitle>
      </Card.Header>
    </Card>
    <Card variant="warning">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
      </Card.Header>
    </Card>
    <Card variant="danger">
      <Card.Header>
        <Avatar alt="Kitten" src="https://i.imgur.com/UM3mrju.jpg" size={40} />
        <Card.HeaderTitle>
          <Typography variant="h5">Title goes here</Typography>
          <Typography variant="caption">Caption</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={iconSize}></Icon>
        </Button>
      </Card.Header>
    </Card>
    <Card variant="warning">
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="overline">Overline</Typography>
          <Typography variant="h6">Title goes here</Typography>
        </Card.HeaderTitle>
        <Button variant="ghost_icon">
          <Icon name="more_vertical" title="more action" size={iconSize}></Icon>
        </Button>
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
        <Card.Content>
          <Typography variant="body_short">
            Leading images are full width, and go straight to the top - ignoring
            spacings
          </Typography>
        </Card.Content>
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
        <Card.Content>
          <Typography variant="body_short">
            Last blocks with fullWidth ignores left and right spacings but keep
            24px bottom spacing
          </Typography>
        </Card.Content>
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
        <Card.Content>
          <Typography variant="body_short">
            Default spacing is 16px between middle blocks
          </Typography>
        </Card.Content>
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
      <Card.Content>
        <Typography variant="body_short">
          Action elements are aligned left in this example
        </Typography>
      </Card.Content>

      <Card.Actions>
        <Button>Cancel</Button>
        <Button variant="ghost">OK</Button>
      </Card.Actions>
    </Card>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h5">Right</Typography>
          <Typography variant="body_short">Right aligned buttons</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant="body_short">
          Action elements are aligned right in this example
        </Typography>
      </Card.Content>
      <Card.Actions alignRight>
        <Button variant="ghost_icon">
          <Icon
            name="person_add"
            title="add person action"
            size={iconSize}
          ></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="settings" title="settings action" size={iconSize}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="save" title="save action" size={iconSize}></Icon>
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
      <Card.Content>
        <Typography variant="body_short">
          Action elements with metadata
        </Typography>
      </Card.Content>
      <Card.Actions meta="Share">
        <Button variant="ghost_icon">
          <Icon name="share" title="share action" size={iconSize}></Icon>
        </Button>
      </Card.Actions>
    </Card>
  </Wrapper>
)
WithActions.storyName = 'With actions'

export const WithDivider: Story<CardProps> = () => (
  <Wrapper>
    <Card>
      <Card.Header>
        <Card.HeaderTitle>
          <Typography variant="h4">TICKET</Typography>
        </Card.HeaderTitle>
        <Typography variant="h6">20.02.2020</Typography>
      </Card.Header>
      <Card.Content>
        <Typography variant="h5">Title</Typography>
        <Typography variant="body_short">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
        <Divider style={{ width: '100%' }} />
      </Card.Content>
      <Card.Content>
        <Typography variant="caption">Choose option</Typography>
      </Card.Content>
      <Card.Actions>
        <Chip>active</Chip>
        <Chip variant="active">pause</Chip>
        <Chip>disable</Chip>
        <Chip variant="error">stop</Chip>
      </Card.Actions>
      <Card.Actions>
        <Button style={{ marginTop: '16px' }} variant="outlined">
          SUBMIT TICKET
        </Button>
      </Card.Actions>
    </Card>
  </Wrapper>
)
WithDivider.storyName = 'With divider'
