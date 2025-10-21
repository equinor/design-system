import { Icon } from '../Icon'
import * as icons from '@equinor/eds-icons'
import { Meta, StoryFn } from '@storybook/react-vite'
import { Stack } from '../../../.storybook/components'
import {
  SIZES,
  GridBackground,
  RealWorldGrid,
  IntroductionGrid,
  Button,
  IconTextRow,
  ButtonRow,
  ComparisonGrid,
  ComparisonRow,
  Label,
} from './Typography.stories.shared'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { TypographyNext as Typography } from './Typography.new'

Icon.add(icons)

const meta: Meta = {
  title: 'Typography/Patterns',
  parameters: {
    docs: {
      description: {
        component:
          'Real-world examples and patterns for using typography components with icons, buttons, and other UI elements.',
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
      <Typography
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Baseline Grid Alignment:
      </Typography>{' '}
      All text components support precise alignment to a 4px baseline grid for
      consistent vertical rhythm.
    </Paragraph>
    <Paragraph>
      <Typography
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Flexible Typography:
      </Typography>{' '}
      Control font family, size, weight, line height, and letter spacing to
      achieve your desired design.
    </Paragraph>
    <Paragraph>
      <Typography
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Accessibility First:
      </Typography>{' '}
      All components are built with WCAG 2.1 AA compliance in mind.
    </Paragraph>

    <Heading as="h3" weight="normal">
      Usage Guidelines
    </Heading>
    <Paragraph>
      Use{' '}
      <Typography
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Heading
      </Typography>{' '}
      components for page and section titles. They always use the header font
      family for visual distinction.
    </Paragraph>
    <Paragraph>
      Use{' '}
      <Typography
        family="ui"
        weight="bolder"
        baseline="grid"
        tracking="normal"
        lineHeight="default"
        size="md"
      >
        Paragraph
      </Typography>{' '}
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
        <Typography
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Baseline Grid Alignment:
        </Typography>{' '}
        All text components support precise alignment to a 4px baseline grid for
        consistent vertical rhythm.
      </Paragraph>
      <Paragraph debug>
        <Typography
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Flexible Typography:
        </Typography>{' '}
        Control font family, size, weight, line height, and letter spacing to
        achieve your desired design.
      </Paragraph>
      <Paragraph debug>
        <Typography
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Accessibility First:
        </Typography>{' '}
        All components are built with WCAG 2.1 AA compliance in mind.
      </Paragraph>

      <Heading as="h3" weight="normal" debug>
        Usage Guidelines
      </Heading>
      <Paragraph debug>
        Use{' '}
        <Typography
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Heading
        </Typography>{' '}
        components for page and section titles. They always use the header font
        family for visual distinction.
      </Paragraph>
      <Paragraph debug>
        Use{' '}
        <Typography
          family="ui"
          weight="bolder"
          baseline="grid"
          tracking="normal"
          lineHeight="default"
          size="md"
          debug
        >
          Paragraph
        </Typography>{' '}
        components for body content. They always use the UI font family
        optimized for readability.
      </Paragraph>
      <Paragraph size="sm" weight="lighter" debug>
        For more information, visit our complete documentation.
      </Paragraph>
    </RealWorldGrid>
  </GridBackground>
)
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
UsageExamples.parameters = {
  docs: {
    description: {
      story:
        'Practical examples of icons and text as siblings in common UI patterns: navigation, buttons, and status messages.',
    },
  },
}
