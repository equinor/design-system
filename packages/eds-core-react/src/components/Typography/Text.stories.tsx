import { Text, Heading, Paragraph } from './Text'
import { Icon } from '../Icon'
import * as icons from '@equinor/eds-icons'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import type { TextProps, HeadingProps, ParagraphProps } from './Text.types'
import styled from 'styled-components'

Icon.add(icons)

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog'
const SIZES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
] as const
const WEIGHTS = ['lighter', 'normal', 'bolder'] as const
const TRACKING_OPTIONS = ['tight', 'normal', 'wide'] as const
const LINE_HEIGHTS = ['default', 'squished'] as const
const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

// Styled Components
const ComparisonGrid = styled.div`
  display: grid;
  gap: 24px;
  margin: 16px 0;
`

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 4px;
`

const Label = styled(Text).attrs<Partial<TextProps>>({
  family: 'ui',
  size: 'xs',
  weight: 'bolder',
  lineHeight: 'default',
  baseline: 'grid',
  tracking: 'normal',
})<Partial<TextProps>>`
  text-transform: uppercase;
  color: #666;
`

const GridBackground = styled.div`
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgba(255, 0, 0, 0.1) 3px,
    rgba(255, 0, 0, 0.1) 4px
  );
  padding: 24px;

  /* Debug mode styling for text elements */
  [data-debug] {
    background: color-mix(in oklch, limegreen, transparent 84%);
  }
`

const RealWorldGrid = styled.section`
  display: grid;
  gap: 16px; /* 4px grid: 16px = 4 * 4px */

  /* Nested sections with 24px gap */
  & > * + h2 {
    margin-top: 24px;
  }

  & > * + h3 {
    margin-top: 20px;
  }
`

const IntroductionGrid = styled.section`
  display: grid;
  gap: 16px;

  & > h2 {
    margin-bottom: 4px;
  }
`

// Example button component using text classes directly
const Button = styled.button<{ $size?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-family: inherit;

  /* Apply text size to the button container */

  &:hover {
    background: #f5f5f5;
  }

  &:active {
    background: #e5e5e5;
  }
`

// Container for demonstrating icon alignment
const IconTextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
`

// Helper Components
const ComparisonSection = ({
  title,
  marginTop,
  children,
}: {
  title: string
  marginTop?: string
  children: React.ReactNode
}) => (
  <>
    <Heading as="h3" style={{ marginTop, marginBottom: '24px' }}>
      {title}
    </Heading>
    <ComparisonGrid>{children}</ComparisonGrid>
  </>
)

const ComparisonRowItem = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <ComparisonRow>
    <Label>{label}</Label>
    {children}
  </ComparisonRow>
)

const HeadingLevelComparison = ({ text = SAMPLE_TEXT }: { text?: string }) => (
  <>
    {HEADING_LEVELS.map((level) => (
      <ComparisonRowItem key={level} label={level.toUpperCase()}>
        <Heading as={level}>{text}</Heading>
      </ComparisonRowItem>
    ))}
  </>
)

const WeightComparison = ({
  component: Component,
  text = SAMPLE_TEXT,
  ...componentProps
}: {
  component: typeof Heading | typeof Paragraph
  text?: string
} & Record<string, unknown>) => (
  <>
    {WEIGHTS.map((weight) => (
      <ComparisonRowItem
        key={weight}
        label={weight.charAt(0).toUpperCase() + weight.slice(1)}
      >
        <Component {...componentProps} weight={weight}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

const TrackingComparison = ({
  component: Component,
  text = SAMPLE_TEXT,
  ...componentProps
}: {
  component: typeof Heading | typeof Paragraph
  text?: string
} & Record<string, unknown>) => (
  <>
    {TRACKING_OPTIONS.map((tracking) => (
      <ComparisonRowItem
        key={tracking}
        label={tracking.charAt(0).toUpperCase() + tracking.slice(1)}
      >
        <Component {...componentProps} tracking={tracking}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

const SizeComparison = ({
  component: Component,
  text = SAMPLE_TEXT,
  ...componentProps
}: {
  component: typeof Paragraph | typeof Text
  text?: string
} & Record<string, unknown>) => (
  <>
    {SIZES.map((size) => (
      <ComparisonRowItem key={size} label={size.toUpperCase()}>
        {/* @ts-expect-error - size prop is valid for both components */}
        <Component {...componentProps} size={size}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

const LineHeightComparison = ({ text = SAMPLE_TEXT }: { text?: string }) => (
  <>
    {LINE_HEIGHTS.map((lineHeight) => (
      <ComparisonRowItem
        key={lineHeight}
        label={lineHeight.charAt(0).toUpperCase() + lineHeight.slice(1)}
      >
        <Paragraph lineHeight={lineHeight}>{text}</Paragraph>
      </ComparisonRowItem>
    ))}
  </>
)

const IconTextRow = ({
  label,
  size,
  text = 'Save your work',
  iconName = 'save',
}: {
  label: string
  size: (typeof SIZES)[number]
  text?: string
  iconName?: string
}) => (
  <ComparisonRowItem label={label}>
    <IconTextContainer className={`font-family-ui text-${size}`}>
      <Icon name={iconName} className="icon" />
      <span className="text-baseline-center">{text}</span>
    </IconTextContainer>
  </ComparisonRowItem>
)

const ButtonRow = ({
  label,
  size,
  children,
  ...extraProps
}: {
  label: string
  size: string
  children: React.ReactNode
} & Record<string, unknown>) => (
  <ComparisonRowItem label={label}>
    <Button
      $size={size}
      className={`font-family-ui text-${size}`}
      {...extraProps}
    >
      {children}
    </Button>
  </ComparisonRowItem>
)

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
  <IntroductionGrid>
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
  </IntroductionGrid>
)

export const HeadingPlayground: StoryFn<HeadingProps> = ({
  debug,
  ...args
}) => {
  const content = <Heading {...args}>{SAMPLE_TEXT}</Heading>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
HeadingPlayground.storyName = 'Heading - Interactive'
HeadingPlayground.args = {
  as: 'h2',
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

export const HeadingComparison: StoryFn = () => (
  <div>
    <ComparisonSection title="Heading Level Comparison">
      <HeadingLevelComparison />
    </ComparisonSection>

    <ComparisonSection title="Font Weight Comparison" marginTop="48px">
      <WeightComparison component={Heading} as="h2" />
    </ComparisonSection>

    <ComparisonSection
      title="Letter Spacing (Tracking) Comparison"
      marginTop="48px"
    >
      <TrackingComparison component={Heading} as="h2" />
    </ComparisonSection>
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

export const ParagraphPlayground: StoryFn<ParagraphProps> = ({
  debug,
  ...args
}) => {
  const content = <Paragraph {...args}>{SAMPLE_TEXT}</Paragraph>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
ParagraphPlayground.storyName = 'Paragraph - Interactive'
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
    options: ['tight', 'normal', 'loose'],
    description: 'Letter spacing (tracking)',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const ParagraphComparison: StoryFn = () => (
  <div>
    <ComparisonSection title="Size Comparison">
      <SizeComparison component={Paragraph} />
    </ComparisonSection>

    <ComparisonSection title="Line Height Comparison" marginTop="48px">
      <LineHeightComparison text={SAMPLE_TEXT} />
    </ComparisonSection>

    <ComparisonSection title="Font Weight Comparison" marginTop="48px">
      <WeightComparison component={Paragraph} />
    </ComparisonSection>

    <ComparisonSection
      title="Letter Spacing (Tracking) Comparison"
      marginTop="48px"
    >
      <TrackingComparison component={Paragraph} />
    </ComparisonSection>
  </div>
)
ParagraphComparison.storyName = 'Paragraph - All Variants'
ParagraphComparison.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive comparison of all paragraph sizes, line heights, font weights, and letter spacing options.',
    },
  },
}

export const TextPlayground: StoryFn<TextProps> = ({ debug, ...args }) => {
  const content = <Text {...args}>{SAMPLE_TEXT}</Text>
  return debug ? <GridBackground>{content}</GridBackground> : content
}
TextPlayground.storyName = 'Text - Interactive'
TextPlayground.args = {
  family: 'ui',
  size: 'md',
  lineHeight: 'default',
  weight: 'normal',
  tracking: 'normal',
  baseline: 'grid',
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
    options: ['grid', 'center'],
    description: 'Baseline alignment strategy',
  },
  debug: {
    control: { type: 'boolean' },
    description: 'Enable debug mode to visualize text box',
  },
}

export const TextSizeScale: StoryFn = () => (
  <div>
    <ComparisonSection title="UI Font Family - Size Scale">
      <SizeComparison
        component={Text}
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
        component={Text}
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
      <Text
        family="ui"
        size="lg"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
      >
        emphasized content
      </Text>{' '}
      or{' '}
      <Text
        family="ui"
        size="sm"
        weight="lighter"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
      >
        de-emphasized content
      </Text>
      . You can mix{' '}
      <Text
        family="header"
        size="xl"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
      >
        header font
      </Text>{' '}
      with regular text for maximum flexibility.
    </Paragraph>
  </Stack>
)
InlineTextStyling.storyName = 'Text - Inline Usage'

export const RealWorldExample: StoryFn = () => (
  <RealWorldGrid>
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
      <Text
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Baseline Grid Alignment:
      </Text>{' '}
      All text components support precise alignment to a 4px baseline grid for
      consistent vertical rhythm.
    </Paragraph>
    <Paragraph>
      <Text
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Flexible Typography:
      </Text>{' '}
      Control font family, size, weight, line height, and letter spacing to
      achieve your desired design.
    </Paragraph>
    <Paragraph>
      <Text
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Accessibility First:
      </Text>{' '}
      All components are built with WCAG 2.1 AA compliance in mind.
    </Paragraph>

    <Heading as="h3" weight="normal">
      Usage Guidelines
    </Heading>
    <Paragraph>
      Use{' '}
      <Text
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Heading
      </Text>{' '}
      components for page and section titles. They always use the header font
      family for visual distinction.
    </Paragraph>
    <Paragraph>
      Use{' '}
      <Text
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Paragraph
      </Text>{' '}
      components for body content. They always use the UI font family optimized
      for readability.
    </Paragraph>
    <Paragraph size="sm" weight="lighter">
      For more information, visit our complete documentation.
    </Paragraph>
  </RealWorldGrid>
)
RealWorldExample.parameters = {
  docs: {
    description: {
      story:
        'A practical example showing how different typography components work together in a documentation page layout. All spacing follows the 4px baseline grid (16px, 20px, 24px).',
    },
  },
}

export const RealWorldWithGrid: StoryFn = () => (
  <GridBackground>
    <RealWorldGrid>
      <Heading as="h1" weight="bolder" debug>
        Design System Documentation
      </Heading>
      <Paragraph size="lg" lineHeight="default" debug>
        Welcome to the Equinor Design System typography components. This system
        provides flexible, accessible, and beautiful typography for your
        applications.
      </Paragraph>

      <Heading as="h2" weight="normal" debug>
        Getting Started
      </Heading>
      <Paragraph debug>
        The typography system is built on a foundation of design tokens that
        ensure consistency across all components. Each component has been
        carefully crafted to work together seamlessly.
      </Paragraph>

      <Heading as="h3" weight="normal" debug>
        Key Features
      </Heading>
      <Paragraph debug>
        <Text
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Baseline Grid Alignment:
        </Text>{' '}
        All text components support precise alignment to a 4px baseline grid for
        consistent vertical rhythm.
      </Paragraph>
      <Paragraph debug>
        <Text
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Flexible Typography:
        </Text>{' '}
        Control font family, size, weight, line height, and letter spacing to
        achieve your desired design.
      </Paragraph>
      <Paragraph debug>
        <Text
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Accessibility First:
        </Text>{' '}
        All components are built with WCAG 2.1 AA compliance in mind.
      </Paragraph>

      <Heading as="h3" weight="normal" debug>
        Usage Guidelines
      </Heading>
      <Paragraph debug>
        Use{' '}
        <Text
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Heading
        </Text>{' '}
        components for page and section titles. They always use the header font
        family for visual distinction.
      </Paragraph>
      <Paragraph debug>
        Use{' '}
        <Text
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Paragraph
        </Text>{' '}
        components for body content. They always use the UI font family
        optimized for readability.
      </Paragraph>
      <Paragraph size="sm" weight="lighter" debug>
        For more information, visit our complete documentation.
      </Paragraph>
    </RealWorldGrid>
  </GridBackground>
)
RealWorldWithGrid.storyName = 'Real World Example - With Grid'
RealWorldWithGrid.parameters = {
  docs: {
    description: {
      story:
        'Same as the Real World Example, but with the 4px baseline grid visible and debug mode enabled. Notice how all text baselines and spacing align perfectly to the grid lines.',
    },
  },
}

export const IconsAsTextSiblings: StoryFn = () => (
  <Stack>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Icons as Siblings to Text Elements
    </Heading>
    <Paragraph style={{ marginBottom: '16px' }}>
      The <code>.icon</code> class is designed for icons that are{' '}
      <strong>siblings</strong> to text elements within a container. The parent
      container defines the font size using <code>text-[size]</code> classes,
      and both the text (with <code>text-baseline-center</code>) and icon (with{' '}
      <code>.icon</code>) adapt automatically.
    </Paragraph>

    <ComparisonGrid>
      {SIZES.map((size) => (
        <IconTextRow
          key={size}
          label={size.toUpperCase()}
          size={size}
          text="Save your work"
        />
      ))}
    </ComparisonGrid>
  </Stack>
)
IconsAsTextSiblings.storyName = 'Icons as Text Siblings - Size Scale'
IconsAsTextSiblings.parameters = {
  docs: {
    description: {
      story:
        'Icons as siblings to text elements. The parent container sets the font-size, and both icon and text adapt. This is the correct pattern for buttons, links, and other interactive elements.',
    },
  },
}

export const ButtonsWithIcons: StoryFn = () => (
  <Stack>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Button Components with Icons
    </Heading>
    <Paragraph style={{ marginBottom: '16px' }}>
      Buttons are a common use case where icons and text are siblings. The
      button element defines the size, and both icon and text inherit from it.
    </Paragraph>

    <ComparisonGrid>
      <ButtonRow label="Small" size="sm">
        <Icon name="save" className="icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
      <ButtonRow label="Medium" size="md">
        <Icon name="save" className="icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
      <ButtonRow label="Large" size="lg">
        <Icon name="save" className="icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
    </ComparisonGrid>

    <Heading as="h4" style={{ marginTop: '24px', marginBottom: '16px' }}>
      Icon Positions in Buttons
    </Heading>

    <ComparisonGrid>
      <ButtonRow label="Leading Icon" size="md">
        <Icon name="add" className="icon" />
        <span className="text-baseline-center">Add Item</span>
      </ButtonRow>
      <ButtonRow label="Trailing Icon" size="md">
        <span className="text-baseline-center">Next</span>
        <Icon name="arrow_forward" className="icon" />
      </ButtonRow>
      <ButtonRow
        label="Icon Only"
        size="md"
        style={{ padding: '8px' }}
        aria-label="Delete"
      >
        <Icon name="delete_to_trash" className="icon" />
      </ButtonRow>
      <ButtonRow label="Both Sides" size="md">
        <Icon name="star_outlined" className="icon" />
        <span className="text-baseline-center">Favorite</span>
        <Icon name="chevron_down" className="icon" />
      </ButtonRow>
    </ComparisonGrid>
  </Stack>
)
ButtonsWithIcons.storyName = 'Buttons with Icons'
ButtonsWithIcons.parameters = {
  docs: {
    description: {
      story:
        'Common button patterns with icons. The button element uses text-[size] classes, and children use .icon and .text-baseline-center for proper alignment.',
    },
  },
}

export const IconTextAlignment: StoryFn = () => (
  <Stack>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Icon and Text Alignment Patterns
    </Heading>
    <Paragraph style={{ marginBottom: '16px' }}>
      Different alignment strategies for different use cases. The{' '}
      <code>text-baseline-center</code> class centers text within its container,
      which is ideal for pairing with icons in flex containers.
    </Paragraph>

    <ComparisonGrid>
      <ComparisonRow>
        <Label>Center Aligned</Label>
        <div
          className="font-family-ui text-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Icon name="info_circle" className="icon" />
          <span className="text-baseline-center">Information message</span>
        </div>
      </ComparisonRow>
      <ComparisonRow>
        <Label>With Link</Label>
        <a
          href="https://example.com"
          className="font-family-ui text-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Icon name="link" className="icon" />
          <span className="text-baseline-center">External link</span>
          <Icon name="external_link" className="icon" />
        </a>
      </ComparisonRow>
      <ComparisonRow>
        <Label>List Item</Label>
        <div
          className="font-family-ui text-md"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Icon name="check_circle_outlined" className="icon" />
          <span className="text-baseline-center">
            Task completed successfully
          </span>
        </div>
      </ComparisonRow>
      <ComparisonRow>
        <Label>Badge/Chip</Label>
        <div
          className="font-family-ui text-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: '#e3f2fd',
            borderRadius: '16px',
          }}
        >
          <Icon name="account_circle" className="icon" />
          <span className="text-baseline-center">John Doe</span>
          <Icon name="close" className="icon" />
        </div>
      </ComparisonRow>
    </ComparisonGrid>
  </Stack>
)
IconTextAlignment.storyName = 'Icon and Text Alignment'
IconTextAlignment.parameters = {
  docs: {
    description: {
      story:
        'Various patterns showing how icons and text work together as siblings in different UI contexts.',
    },
  },
}

export const IconAlignmentWithGrid: StoryFn = () => (
  <GridBackground>
    <Stack>
      <Heading as="h3" debug style={{ marginBottom: '24px' }}>
        Icon Alignment with Baseline Grid
      </Heading>
      <Paragraph debug style={{ marginBottom: '16px' }}>
        When icons are siblings to text with <code>text-baseline-center</code>,
        they maintain visual harmony with the baseline grid system.
      </Paragraph>

      <div
        className="font-family-ui text-md"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        data-debug
      >
        <Icon name="info_circle" className="icon" />
        <span className="text-baseline-center" data-debug>
          Medium text with centered baseline
        </span>
      </div>

      <div
        className="font-family-ui text-lg"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
        data-debug
      >
        <Icon name="warning_outlined" className="icon" />
        <span className="text-baseline-center" data-debug>
          Large text with centered baseline
        </span>
      </div>

      <div
        className="font-family-ui text-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
        data-debug
      >
        <Icon name="check" className="icon" />
        <span className="text-baseline-center" data-debug>
          Small text with centered baseline
        </span>
      </div>

      <Button
        $size="md"
        className="font-family-ui text-md"
        style={{ marginTop: '16px' }}
        data-debug
      >
        <Icon name="save" className="icon" />
        <span className="text-baseline-center" data-debug>
          Button with icon
        </span>
      </Button>
    </Stack>
  </GridBackground>
)
IconAlignmentWithGrid.storyName = 'Icon Alignment with Grid'
IconAlignmentWithGrid.parameters = {
  docs: {
    description: {
      story:
        'Debug mode showing how icon and text siblings align to the baseline grid. The text-baseline-center class centers text within its container for optical alignment with icons.',
    },
  },
}

export const UsageExamples: StoryFn = () => (
  <Stack>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Real-World Usage Examples
    </Heading>

    <Heading as="h4" style={{ marginBottom: '12px' }}>
      Navigation Menu
    </Heading>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <a
        href="https://example.com"
        className="font-family-ui text-md"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Icon name="home" className="icon" />
        <span className="text-baseline-center">Home</span>
      </a>
      <a
        href="https://example.com"
        className="font-family-ui text-md"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Icon name="dashboard" className="icon" />
        <span className="text-baseline-center">Dashboard</span>
      </a>
      <a
        href="https://example.com"
        className="font-family-ui text-md"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Icon name="settings" className="icon" />
        <span className="text-baseline-center">Settings</span>
      </a>
    </div>

    <Heading as="h4" style={{ marginTop: '24px', marginBottom: '12px' }}>
      Action Buttons
    </Heading>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button $size="md" className="font-family-ui text-md">
        <Icon name="save" className="icon" />
        <span className="text-baseline-center">Save</span>
      </Button>
      <Button $size="md" className="font-family-ui text-md">
        <Icon name="file_description" className="icon" />
        <span className="text-baseline-center">Export</span>
      </Button>
      <Button $size="md" className="font-family-ui text-md">
        <Icon name="delete_to_trash" className="icon" />
        <span className="text-baseline-center">Delete</span>
      </Button>
      <Button $size="md" className="font-family-ui text-md">
        <span className="text-baseline-center">Share</span>
        <Icon name="share" className="icon" />
      </Button>
    </div>

    <Heading as="h4" style={{ marginTop: '24px', marginBottom: '12px' }}>
      Status Messages
    </Heading>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        className="font-family-ui text-md"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#2e7d32',
        }}
      >
        <Icon name="check_circle_outlined" className="icon" />
        <span className="text-baseline-center">
          Your changes have been saved
        </span>
      </div>
      <div
        className="font-family-ui text-md"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ed6c02',
        }}
      >
        <Icon name="warning_outlined" className="icon" />
        <span className="text-baseline-center">
          Please review before submitting
        </span>
      </div>
      <div
        className="font-family-ui text-md"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#d32f2f',
        }}
      >
        <Icon name="error_outlined" className="icon" />
        <span className="text-baseline-center">An error has occurred</span>
      </div>
      <div
        className="font-family-ui text-md"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0288d1',
        }}
      >
        <Icon name="info_circle" className="icon" />
        <span className="text-baseline-center">
          Updates available for download
        </span>
      </div>
    </div>
  </Stack>
)
UsageExamples.storyName = 'Real-World Usage Examples'
UsageExamples.parameters = {
  docs: {
    description: {
      story:
        'Practical examples of icons and text as siblings in common UI patterns: navigation, buttons, and status messages.',
    },
  },
}
