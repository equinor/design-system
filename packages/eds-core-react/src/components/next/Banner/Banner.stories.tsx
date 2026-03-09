import type { Meta, StoryFn } from '@storybook/react-vite'
import {
  info_circle,
  warning_filled,
  error_filled,
  check_circle_outlined,
} from '@equinor/eds-icons'
import { Banner } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'

const meta: Meta<typeof Banner> = {
  title: 'EDS 2.0 (beta)/Feedback/Banner',
  component: Banner,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Banner displays important, succinct messages. It can also provide actions for the user to address or dismiss.',
      },
    },
  },
}

export default meta

const exampleMessage =
  'Please make sure this banner is used correctly when used in a manner to inform, warn or advice users.'

export const Introduction: StoryFn<typeof Banner> = (args) => (
  <Banner {...args}>
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)

export const WithIcon: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Icon>
      <Icon data={info_circle} />
    </Banner.Icon>
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)

export const WithActions: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Message>{exampleMessage}</Banner.Message>
    <Banner.Actions>
      <Button>Action</Button>
    </Banner.Actions>
  </Banner>
)

export const ActionsBottom: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Message>{exampleMessage}</Banner.Message>
    <Banner.Actions placement="bottom">
      <Button>Ok</Button>
      <Button variant="secondary">Cancel</Button>
    </Banner.Actions>
  </Banner>
)

export const Warning: StoryFn<typeof Banner> = () => (
  <Banner tone="warning">
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)

export const Danger: StoryFn<typeof Banner> = () => (
  <Banner tone="danger">
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)

export const Success: StoryFn<typeof Banner> = () => (
  <Banner tone="success">
    <Banner.Icon>
      <Icon data={check_circle_outlined} />
    </Banner.Icon>
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)

export const AllVariants: StoryFn<typeof Banner> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Banner tone="info">
      <Banner.Icon>
        <Icon data={info_circle} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Button>Ok</Button>
        <Button variant="secondary">Cancel</Button>
      </Banner.Actions>
    </Banner>

    <Banner tone="warning">
      <Banner.Icon>
        <Icon data={warning_filled} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Button>Ok</Button>
        <Button variant="secondary">Cancel</Button>
      </Banner.Actions>
    </Banner>

    <Banner tone="danger">
      <Banner.Icon>
        <Icon data={error_filled} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions placement="bottom">
        <Button>Ok</Button>
        <Button variant="secondary">Cancel</Button>
      </Banner.Actions>
    </Banner>

    <Banner tone="success">
      <Banner.Icon>
        <Icon data={check_circle_outlined} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Button>Ok</Button>
      </Banner.Actions>
    </Banner>
  </div>
)
