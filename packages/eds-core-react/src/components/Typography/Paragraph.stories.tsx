import { Paragraph } from './Paragraph'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { ParagraphProps } from './Paragraph.types'
import {
  SAMPLE_TEXT,
  GridBackground,
  ComparisonSection,
  SizeComparison,
  LineHeightComparison,
  WeightComparison,
  TrackingComparison,
} from './Typography.stories.shared'

const meta: Meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  parameters: {
    docs: {
      description: {
        component:
          'Block-level paragraph component that always uses the UI font family, optimized for readability.',
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

export const Playground: StoryFn<ParagraphProps> = ({ debug, ...args }) => {
  const content = (
    <Paragraph {...args} debug={debug}>
      {SAMPLE_TEXT}
    </Paragraph>
  )
  return debug ? <GridBackground>{content}</GridBackground> : content
}

export const AllVariants: StoryFn = () => (
  <div>
    <ComparisonSection title="Size">
      <SizeComparison component={Paragraph} />
    </ComparisonSection>

    <ComparisonSection title="Line Height" marginTop="48px">
      <LineHeightComparison text={SAMPLE_TEXT} />
    </ComparisonSection>

    <ComparisonSection title="Font Weight" marginTop="48px">
      <WeightComparison component={Paragraph} />
    </ComparisonSection>

    <ComparisonSection title="Letter Spacing (Tracking)" marginTop="48px">
      <TrackingComparison component={Paragraph} />
    </ComparisonSection>
  </div>
)
AllVariants.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive comparison of all paragraph sizes, line heights, font weights, and letter spacing options.',
    },
  },
}
