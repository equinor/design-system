import { Heading } from './Heading'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { HeadingProps } from './Heading.types'
import {
  SAMPLE_TEXT,
  GridBackground,
  ComparisonSection,
  HeadingLevelComparison,
  WeightComparison,
  TrackingComparison,
} from './Typography.stories.shared'

const meta: Meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    docs: {
      description: {
        component:
          'Semantic heading component (h1-h6) that always uses the header font family for visual distinction.',
      },
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

export const Playground: StoryFn<HeadingProps> = ({ debug, ...args }) => {
  const content = <Heading {...args}>{SAMPLE_TEXT}</Heading>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
Playground.args = {
  as: 'h2',
  weight: 'normal',
  tracking: 'normal',
  debug: false,
}
Playground.argTypes = {
  as: {
    control: { type: 'select' },
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    description: 'HTML heading level',
  },
  weight: {
    control: { type: 'select' },
    options: ['lighter', 'normal', 'bolder'],
    description: 'Font weight',
  },
  tracking: {
    control: { type: 'select' },
    options: ['tight', 'normal', 'wide'],
    description: 'Letter spacing (tracking)',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const AllVariants: StoryFn = () => (
  <div>
    <ComparisonSection title="Heading Level">
      <HeadingLevelComparison />
    </ComparisonSection>

    <ComparisonSection title="Font Weight" marginTop="48px">
      <WeightComparison component={Heading} as="h2" />
    </ComparisonSection>

    <ComparisonSection title="Letter Spacing (Tracking)" marginTop="48px">
      <TrackingComparison component={Heading} as="h2" />
    </ComparisonSection>
  </div>
)
AllVariants.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive comparison of all heading levels, font weights, and letter spacing options. Use this to understand the visual hierarchy and styling options available.',
    },
  },
}
