import { useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import {
  info_circle,
  warning_outlined,
  error_outlined,
  check_circle_outlined,
} from '@equinor/eds-icons'
import { Banner } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import page from './Banner.docs.mdx'

const meta: Meta<typeof Banner> = {
  title: 'EDS 2.0 (beta)/Feedback/Banner',
  component: Banner,
  tags: ['beta'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
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

export const Overview: StoryFn<typeof Banner> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Banner>
      <Banner.Icon>
        <Icon data={info_circle} />
      </Banner.Icon>
      <Banner.Message>Your changes have been saved.</Banner.Message>
    </Banner>
    <Banner tone="warning">
      <Banner.Icon>
        <Icon data={warning_outlined} />
      </Banner.Icon>
      <Banner.Message>Your session ends in 5 minutes.</Banner.Message>
      <Banner.Actions>
        <Button>Stay signed in</Button>
      </Banner.Actions>
    </Banner>
  </div>
)

export const WithIcon: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Icon>
      <Icon data={info_circle} />
    </Banner.Icon>
    <Banner.Message>{exampleMessage}</Banner.Message>
  </Banner>
)
WithIcon.parameters = {
  docs: {
    description: {
      story:
        'Add `Banner.Icon` to show an icon before the message. The icon is yours to choose, because Banner does not add one for the tone.',
    },
  },
}

export const WithActions: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Message>{exampleMessage}</Banner.Message>
    <Banner.Actions>
      <Button>Action</Button>
    </Banner.Actions>
  </Banner>
)
WithActions.parameters = {
  docs: {
    description: {
      story:
        'Put buttons in `Banner.Actions`. By default they sit beside the message.',
    },
  },
}

export const ActionsBottom: StoryFn<typeof Banner> = () => (
  <Banner>
    <Banner.Message>{exampleMessage}</Banner.Message>
    <Banner.Actions placement="bottom">
      <Button>Ok</Button>
      <Button variant="secondary">Cancel</Button>
    </Banner.Actions>
  </Banner>
)
ActionsBottom.parameters = {
  docs: {
    description: {
      story:
        'Set `placement="bottom"` on `Banner.Actions` to put the actions below the message, across the full width.',
    },
  },
}

export const WithLink: StoryFn<typeof Banner> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Banner>
      <Banner.Icon>
        <Icon data={info_circle} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Link href="https://eds.equinor.com">Link</Link>
      </Banner.Actions>
    </Banner>
    <Banner>
      <Banner.Icon>
        <Icon data={info_circle} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions placement="bottom">
        <Link href="https://eds.equinor.com">Link</Link>
      </Banner.Actions>
    </Banner>
  </div>
)
WithLink.parameters = {
  docs: {
    description: {
      story:
        'A link in `Banner.Actions` works like a button. It sits beside the message by default, or below it with `placement="bottom"`.',
    },
  },
}

export const Dismissible: StoryFn<typeof Banner> = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Show banner</Button>
  }

  return (
    <Banner onDismiss={() => setVisible(false)}>
      <Banner.Icon>
        <Icon data={info_circle} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
    </Banner>
  )
}
Dismissible.parameters = {
  docs: {
    description: {
      story:
        'Pass `onDismiss` to show a close button. Banner only calls it, so your code removes the banner, as this example does with state.',
    },
  },
}

export const AllVariants: StoryFn<typeof Banner> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Banner>
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
        <Icon data={warning_outlined} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Button>Ok</Button>
        <Button variant="secondary">Cancel</Button>
      </Banner.Actions>
    </Banner>
    <Banner tone="danger">
      <Banner.Icon>
        <Icon data={error_outlined} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
      <Banner.Actions>
        <Link href="https://eds.equinor.com">Link</Link>
      </Banner.Actions>
    </Banner>
    <Banner tone="success" onDismiss={() => {}}>
      <Banner.Icon>
        <Icon data={check_circle_outlined} />
      </Banner.Icon>
      <Banner.Message>{exampleMessage}</Banner.Message>
    </Banner>
  </div>
)
AllVariants.parameters = {
  docs: {
    description: {
      story:
        'Every tone, with the same message. Info is the default. Use warning for something that may need attention, danger for an error and success to confirm that something went well. Info and warning have two buttons, danger has a link and success has a Dismiss button.',
    },
  },
}
