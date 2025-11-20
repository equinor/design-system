import type { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../../.storybook/components'
import { Placeholder } from './Placeholder'
import type { PlaceholderProps } from './Placeholder.types'

const meta: Meta<typeof Placeholder> = {
  title: 'EDS 2.0/Placeholder',
  component: Placeholder,
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
  parameters: {
    badges: ['next'],
    docs: {
      description: {
        component:
          'Lightweight placeholder component used to scaffold EDS 2.0 workspaces under the /next entry point.',
      },
    },
  },
}

export default meta

export const Playground: StoryFn<PlaceholderProps> = (args) => (
  <Placeholder {...args}>
    <div>
      <strong>@equinor/eds-core-react/next</strong>
      <div>Drop in-progress components here</div>
    </div>
  </Placeholder>
)

Playground.args = {
  tone: 'neutral',
}

export const TonePreview: StoryFn = () => (
  <Stack>
    <Placeholder tone="neutral">Neutral tone</Placeholder>
    <Placeholder tone="accent">Accent tone</Placeholder>
    <Placeholder tone="info">Info tone</Placeholder>
    <Placeholder tone="success">Success tone</Placeholder>
    <Placeholder tone="warning">Warning tone</Placeholder>
    <Placeholder tone="danger">Danger tone</Placeholder>
  </Stack>
)

TonePreview.parameters = {
  docs: {
    description: {
      story:
        'Preview of the placeholder helper component with every semantic tone available for quick debugging.',
    },
  },
}
