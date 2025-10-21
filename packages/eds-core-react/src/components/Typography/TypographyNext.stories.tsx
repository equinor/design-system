import { TypographyNext } from './Typography.new'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { TypographyNextProps } from './Typography.new.types'
import type { HeadingProps } from './Heading.types'
import type { ParagraphProps } from './Paragraph.types'
import {
  SAMPLE_TEXT,
  GridBackground,
  ComparisonSection,
  SizeComparison,
} from './Text.stories.shared'

const meta: Meta = {
  title: 'Typography/TypographyNext',
  component: TypographyNext,
  parameters: {
    docs: {
      description: {
        component: `
# TypographyNext

The next generation of the Typography component system. It will replace the existing Typography component in the next major version.

## Features

The new typography system provides:
* **Baseline grid alignment** for consistent vertical rhythm
* **More granular control** over font properties
* **Three specialized components**: \`TextNext\`, \`HeadingNext\`, and \`ParagraphNext\`
* **Better performance** and smaller bundle size
* **Improved accessibility** features

## Usage

### Import

Import the components with aliasing for a seamless experience:

\`\`\`tsx
import { TypographyNext as Typography, Heading, Paragraph } from '@equinor/eds-core-react'

// Use the components
<Heading as="h1">Welcome</Heading>
<Paragraph size="lg">This is a paragraph with the new typography system.</Paragraph>
<Typography family="ui" size="md" lineHeight="default" baseline="grid" weight="normal" tracking="normal">
  Flexible inline text
</Typography>
\`\`\`

### Migration Timeline

1. **Now**: Use the new components with aliasing (\`TypographyNext as Typography\`)
2. **Parallel support**: 6-12 months of both systems supported
3. **Next major version**: \`TypographyNext\` becomes the default \`Typography\` export

### Key Differences from Current Typography

* **Component names**: Three specialized components -- \`TypographyNext\`, \`Heading\`, and \`Paragraph\`
* **Baseline alignment**: Built-in support for baseline grid alignment
* **Props**: More explicit control over typography properties
* **Semantic HTML**: \`Heading\` renders proper heading tags, \`Paragraph\` renders \`<p>\` tags

## Need Help?

Visit the [migration guide](#) or reach out to the EDS team with questions.
        `,
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

export const TypographyPlayground: StoryFn<TypographyNextProps> = ({
  debug,
  ...args
}) => {
  const content = <TypographyNext {...args}>{SAMPLE_TEXT}</TypographyNext>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
TypographyPlayground.args = {
  family: 'ui',
  size: 'md',
  lineHeight: 'default',
  weight: 'normal',
  tracking: 'normal',
  baseline: 'grid',
  debug: false,
}
TypographyPlayground.argTypes = {
  family: {
    control: { type: 'select' },
    options: ['ui', 'header'],
    description: 'Font family',
  },
  size: {
    control: { type: 'select' },
    options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
    description: 'Font size',
  },
  lineHeight: {
    control: { type: 'select' },
    options: ['default', 'squished'],
    description: 'Line height variant',
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
  baseline: {
    control: { type: 'select' },
    options: ['grid', 'center'],
    description: 'Baseline alignment strategy',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}
TypographyPlayground.parameters = {
  docs: {
    description: {
      story:
        'The TypographyNext component provides full control over typography properties. Use it for inline text with specific styling needs.',
    },
  },
}

export const HeadingPlayground: StoryFn<HeadingProps> = ({
  debug,
  ...args
}) => {
  const content = <Heading {...args}>Heading Example</Heading>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
HeadingPlayground.args = {
  as: 'h1',
  weight: 'normal',
  tracking: 'normal',
  debug: false,
}
HeadingPlayground.argTypes = {
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
HeadingPlayground.parameters = {
  docs: {
    description: {
      story:
        'The HeadingNext component renders semantic heading tags (h1-h6) with appropriate typography. Size and line-height are automatically determined by the heading level.',
    },
  },
}

export const ParagraphPlayground: StoryFn<ParagraphProps> = ({
  debug,
  ...args
}) => {
  const content = (
    <Paragraph {...args}>
      This is a paragraph using the new typography system. The paragraph
      component automatically aligns to the baseline grid and provides
      consistent spacing for body text.
    </Paragraph>
  )
  return debug ? <GridBackground>{content}</GridBackground> : content
}
ParagraphPlayground.args = {
  size: 'md',
  lineHeight: 'default',
  weight: 'normal',
  tracking: 'normal',
  debug: false,
}
ParagraphPlayground.argTypes = {
  size: {
    control: { type: 'select' },
    options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
    description: 'Font size',
  },
  lineHeight: {
    control: { type: 'select' },
    options: ['default', 'squished'],
    description: 'Line height variant',
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
ParagraphPlayground.parameters = {
  docs: {
    description: {
      story:
        'The ParagraphNext component renders semantic paragraph tags with typography aligned to the baseline grid.',
    },
  },
}

export const AllComponents: StoryFn = () => (
  <div>
    <Heading as="h1">Heading Level 1</Heading>
    <Paragraph size="lg">
      This is a large paragraph that follows the heading. Notice how everything
      aligns to the baseline grid for consistent vertical rhythm.
    </Paragraph>

    <Heading as="h2">Heading Level 2</Heading>
    <Paragraph>
      This is a standard paragraph with default size. You can use{' '}
      <TypographyNext
        family="ui"
        size="md"
        lineHeight="default"
        baseline="center"
        weight="bolder"
        tracking="normal"
      >
        TypographyNext for inline emphasis
      </TypographyNext>{' '}
      within your paragraphs.
    </Paragraph>

    <Heading as="h3">Heading Level 3</Heading>
    <Paragraph size="sm">
      This is a smaller paragraph. The new typography system provides better
      control over sizing and spacing while maintaining accessibility.
    </Paragraph>
  </div>
)
AllComponents.parameters = {
  docs: {
    description: {
      story:
        'Example showing all three new typography components working together with proper semantic HTML and baseline alignment.',
    },
  },
}

export const SizeScale: StoryFn = () => (
  <div>
    <ComparisonSection title="UI Font Family - Size Scale">
      <SizeComparison
        component={TypographyNext}
        family="ui"
        lineHeight="default"
        baseline="grid"
        tracking="normal"
        weight="normal"
        text={SAMPLE_TEXT}
      />
    </ComparisonSection>

    <ComparisonSection title="Header Font Family - Size Scale" marginTop="48px">
      <SizeComparison
        component={TypographyNext}
        family="header"
        lineHeight="default"
        baseline="grid"
        tracking="normal"
        weight="normal"
        text={SAMPLE_TEXT}
      />
    </ComparisonSection>
  </div>
)
SizeScale.parameters = {
  docs: {
    description: {
      story:
        'Complete size scale for both UI and header font families in the new typography system.',
    },
  },
}
