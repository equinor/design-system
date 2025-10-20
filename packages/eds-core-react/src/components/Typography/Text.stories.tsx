import { Text, Heading, Paragraph } from './Text'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { TextProps, HeadingProps, ParagraphProps } from './Text.types'
import styled from 'styled-components'

const ComparisonGrid = styled.div`
  display: grid;
  gap: 24px;
  margin: 16px 0;
`

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 4px;
`

const Label = styled(Text).attrs({
  family: 'ui',
  size: 'xs',
  weight: 'bolder',
})`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
`

const meta: Meta = {
  title: 'Typography/Text Components',
  parameters: {
    docs: {
      description: {
        component:
          'Flexible typography components with baseline grid support and comprehensive styling options.',
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

export const Introduction: StoryFn = () => (
  <section>
    <Heading as="h2">Text Components Overview</Heading>
    <Paragraph>
      The typography system includes three main components: Text, Heading, and
      Paragraph. Each component provides different levels of control and
      semantic meaning.
    </Paragraph>
    <Paragraph>
      <strong>Text:</strong> A flexible inline component with full control over
      font family, size, and other properties.
    </Paragraph>
    <Paragraph>
      <strong>Heading:</strong> Semantic heading component (h1-h6) that always
      uses the header font family.
    </Paragraph>
    <Paragraph>
      <strong>Paragraph:</strong> Block-level component that always uses the UI
      font family.
    </Paragraph>
  </section>
)

export const HeadingPlayground: StoryFn<HeadingProps> = (args) => (
  <Heading {...args}>The quick brown fox jumps over the lazy dog</Heading>
)
HeadingPlayground.storyName = 'Heading - Interactive'
HeadingPlayground.args = {
  as: 'h2',
  weight: 'normal',
  tracking: 'normal',
  baseline: undefined,
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
    options: ['tight', 'normal', 'loose'],
    description: 'Letter spacing (tracking)',
  },
  baseline: {
    control: { type: 'select' },
    options: [undefined, 'grid', 'center'],
    description: 'Baseline alignment strategy',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const HeadingComparison: StoryFn = () => (
  <div>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Heading Level Comparison
    </Heading>
    <ComparisonGrid>
      <ComparisonRow>
        <Label>H1</Label>
        <Heading as="h1">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>H2</Label>
        <Heading as="h2">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>H3</Label>
        <Heading as="h3">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>H4</Label>
        <Heading as="h4">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>H5</Label>
        <Heading as="h5">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>H6</Label>
        <Heading as="h6">The quick brown fox jumps over the lazy dog</Heading>
      </ComparisonRow>
    </ComparisonGrid>

    <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
      Font Weight Comparison
    </Heading>
    <ComparisonGrid>
      <ComparisonRow>
        <Label>Lighter</Label>
        <Heading as="h2" weight="lighter">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>Normal</Label>
        <Heading as="h2" weight="normal">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>Bolder</Label>
        <Heading as="h2" weight="bolder">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
    </ComparisonGrid>

    <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
      Letter Spacing (Tracking) Comparison
    </Heading>
    <ComparisonGrid>
      <ComparisonRow>
        <Label>Tight</Label>
        <Heading as="h2" tracking="tight">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>Normal</Label>
        <Heading as="h2" tracking="normal">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
      <ComparisonRow>
        <Label>Loose</Label>
        <Heading as="h2" tracking="loose">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </ComparisonRow>
    </ComparisonGrid>
  </div>
)
HeadingComparison.storyName = 'Heading - All Variants'
HeadingComparison.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive comparison of all heading levels, font weights, and letter spacing options. Use this to understand the visual hierarchy and styling options available.',
    },
  },
}

export const ParagraphPlayground: StoryFn<ParagraphProps> = (args) => (
  <Paragraph {...args}>
    The quick brown fox jumps over the lazy dog. This is sample text to
    demonstrate paragraph styling with various options. Typography is a critical
    component of any design system, providing the foundation for readable and
    accessible content.
  </Paragraph>
)
ParagraphPlayground.storyName = 'Paragraph - Interactive'
ParagraphPlayground.args = {
  size: 'md',
  lineHeight: 'default',
  weight: 'normal',
  tracking: 'normal',
  baseline: undefined,
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
    options: ['tight', 'normal', 'loose'],
    description: 'Letter spacing (tracking)',
  },
  baseline: {
    control: { type: 'select' },
    options: [undefined, 'grid', 'center'],
    description: 'Baseline alignment strategy',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const ParagraphComparison: StoryFn = () => {
  const sampleText = 'The quick brown fox jumps over the lazy dog.'

  return (
    <div>
      <Heading as="h3" style={{ marginBottom: '24px' }}>
        Size Comparison
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>XS</Label>
          <Paragraph size="xs">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>SM</Label>
          <Paragraph size="sm">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>MD (Default)</Label>
          <Paragraph size="md">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>LG</Label>
          <Paragraph size="lg">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>XL</Label>
          <Paragraph size="xl">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>2XL</Label>
          <Paragraph size="2xl">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>3XL</Label>
          <Paragraph size="3xl">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>4XL</Label>
          <Paragraph size="4xl">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>5XL</Label>
          <Paragraph size="5xl">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>6XL</Label>
          <Paragraph size="6xl">{sampleText}</Paragraph>
        </ComparisonRow>
      </ComparisonGrid>

      <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
        Line Height Comparison
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>Default</Label>
          <Paragraph lineHeight="default">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>Squished</Label>
          <Paragraph lineHeight="squished">{sampleText}</Paragraph>
        </ComparisonRow>
      </ComparisonGrid>

      <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
        Font Weight Comparison
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>Lighter</Label>
          <Paragraph weight="lighter">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>Normal</Label>
          <Paragraph weight="normal">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>Bolder</Label>
          <Paragraph weight="bolder">{sampleText}</Paragraph>
        </ComparisonRow>
      </ComparisonGrid>

      <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
        Letter Spacing (Tracking) Comparison
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>Tight</Label>
          <Paragraph tracking="tight">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>Normal</Label>
          <Paragraph tracking="normal">{sampleText}</Paragraph>
        </ComparisonRow>
        <ComparisonRow>
          <Label>Loose</Label>
          <Paragraph tracking="loose">{sampleText}</Paragraph>
        </ComparisonRow>
      </ComparisonGrid>
    </div>
  )
}
ParagraphComparison.storyName = 'Paragraph - All Variants'
ParagraphComparison.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive comparison of all paragraph sizes, line heights, font weights, and letter spacing options.',
    },
  },
}

export const TextPlayground: StoryFn<TextProps> = (args) => (
  <Text {...args}>The quick brown fox jumps over the lazy dog</Text>
)
TextPlayground.storyName = 'Text - Interactive'
TextPlayground.args = {
  family: 'ui',
  size: 'md',
  lineHeight: 'default',
  weight: 'normal',
  tracking: 'normal',
  baseline: undefined,
  debug: false,
}
TextPlayground.argTypes = {
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
    options: ['tight', 'normal', 'loose'],
    description: 'Letter spacing (tracking)',
  },
  baseline: {
    control: { type: 'select' },
    options: [undefined, 'grid', 'center'],
    description: 'Baseline alignment strategy',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const TextSizeScale: StoryFn = () => {
  const sampleText = 'The quick brown fox'

  return (
    <div>
      <Heading as="h3" style={{ marginBottom: '24px' }}>
        UI Font Family - Size Scale
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>XS</Label>
          <Text family="ui" size="xs">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>SM</Label>
          <Text family="ui" size="sm">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>MD</Label>
          <Text family="ui" size="md">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>LG</Label>
          <Text family="ui" size="lg">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>XL</Label>
          <Text family="ui" size="xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>2XL</Label>
          <Text family="ui" size="2xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>3XL</Label>
          <Text family="ui" size="3xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>4XL</Label>
          <Text family="ui" size="4xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>5XL</Label>
          <Text family="ui" size="5xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>6XL</Label>
          <Text family="ui" size="6xl">
            {sampleText}
          </Text>
        </ComparisonRow>
      </ComparisonGrid>

      <Heading as="h3" style={{ marginTop: '48px', marginBottom: '24px' }}>
        Header Font Family - Size Scale
      </Heading>
      <ComparisonGrid>
        <ComparisonRow>
          <Label>XS</Label>
          <Text family="header" size="xs">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>SM</Label>
          <Text family="header" size="sm">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>MD</Label>
          <Text family="header" size="md">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>LG</Label>
          <Text family="header" size="lg">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>XL</Label>
          <Text family="header" size="xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>2XL</Label>
          <Text family="header" size="2xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>3XL</Label>
          <Text family="header" size="3xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>4XL</Label>
          <Text family="header" size="4xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>5XL</Label>
          <Text family="header" size="5xl">
            {sampleText}
          </Text>
        </ComparisonRow>
        <ComparisonRow>
          <Label>6XL</Label>
          <Text family="header" size="6xl">
            {sampleText}
          </Text>
        </ComparisonRow>
      </ComparisonGrid>
    </div>
  )
}
TextSizeScale.storyName = 'Text - Size Scale'
TextSizeScale.parameters = {
  docs: {
    description: {
      story:
        'Complete size scale for both UI and header font families. This helps understand the typographic hierarchy.',
    },
  },
}

export const InlineTextStyling: StoryFn = () => (
  <Stack>
    <Paragraph>
      The Text component can be used for inline styling. For example,{' '}
      <Text family="ui" size="lg" weight="bolder">
        emphasized content
      </Text>{' '}
      or{' '}
      <Text family="ui" size="sm" weight="lighter">
        de-emphasized content
      </Text>
      . You can mix{' '}
      <Text family="header" size="xl" weight="bolder">
        header font
      </Text>{' '}
      with regular text for maximum flexibility.
    </Paragraph>
  </Stack>
)
InlineTextStyling.storyName = 'Text - Inline Usage'

export const RealWorldExample: StoryFn = () => (
  <section>
    <Heading as="h1" weight="bolder">
      Design System Documentation
    </Heading>
    <Paragraph size="lg" lineHeight="default">
      Welcome to the Equinor Design System typography components. This system
      provides flexible, accessible, and beautiful typography for your
      applications.
    </Paragraph>

    <Heading as="h2" weight="normal">
      Getting Started
    </Heading>
    <Paragraph>
      The typography system is built on a foundation of design tokens that
      ensure consistency across all components. Each component has been
      carefully crafted to work together seamlessly.
    </Paragraph>

    <Heading as="h3" weight="normal">
      Key Features
    </Heading>
    <Paragraph>
      <Text family="ui" weight="bolder">
        Baseline Grid Alignment:
      </Text>{' '}
      All text components support precise alignment to a 4px baseline grid for
      consistent vertical rhythm.
    </Paragraph>
    <Paragraph>
      <Text family="ui" weight="bolder">
        Flexible Typography:
      </Text>{' '}
      Control font family, size, weight, line height, and letter spacing to
      achieve your desired design.
    </Paragraph>
    <Paragraph>
      <Text family="ui" weight="bolder">
        Accessibility First:
      </Text>{' '}
      All components are built with WCAG 2.1 AA compliance in mind.
    </Paragraph>

    <Heading as="h3" weight="normal">
      Usage Guidelines
    </Heading>
    <Paragraph>
      Use{' '}
      <Text family="ui" weight="bolder">
        Heading
      </Text>{' '}
      components for page and section titles. They always use the header font
      family for visual distinction.
    </Paragraph>
    <Paragraph>
      Use{' '}
      <Text family="ui" weight="bolder">
        Paragraph
      </Text>{' '}
      components for body content. They always use the UI font family optimized
      for readability.
    </Paragraph>
    <Paragraph size="sm" weight="lighter">
      For more information, visit our complete documentation.
    </Paragraph>
  </section>
)
RealWorldExample.storyName = 'Real World Example'
RealWorldExample.parameters = {
  docs: {
    description: {
      story:
        'A practical example showing how different typography components work together in a documentation page layout.',
    },
  },
}

export const Debug: StoryFn = () => (
  <Stack>
    <Paragraph>
      Enable debug mode to visualize text box trimming and baseline alignment:
    </Paragraph>
    <Heading as="h2" debug>
      Heading with Debug Mode
    </Heading>
    <Paragraph debug>
      This paragraph has debug mode enabled, showing the text box with a
      background color to help visualize alignment and spacing.
    </Paragraph>
    <Text family="ui" size="lg" debug>
      Text component with debug mode
    </Text>
  </Stack>
)
Debug.parameters = {
  docs: {
    description: {
      story:
        'Debug mode adds a visual background to help developers understand text box alignment and spacing.',
    },
  },
}
