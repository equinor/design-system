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
  ShowcaseGrid,
  ShowcaseCard,
  ShowcaseItem,
  UsageSection,
  UsageCategory,
  CategoryHeader,
  GridShowcaseWrapper,
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
          'Examples and patterns for using typography components with icons, buttons, and other UI elements.',
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
      The typography system includes three main components: Typography, Heading, and
      Paragraph. Each component provides different levels of control and
      semantic meaning.
    </Paragraph>
    <Paragraph>
      <strong>Typography:</strong> A flexible inline component with full control over
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
        'Same as the example, but with the 4px baseline grid visible and debug mode enabled. Notice how all text baselines and spacing align perfectly to the grid lines.',
    },
  },
}

export const IconsAsTextSiblings: StoryFn = () => (
  <Stack>
    <Heading as="h3" style={{ marginBottom: '24px' }}>
      Icons as siblings to text elements
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
        <Icon name="save" className="text-icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
      <ButtonRow label="Medium" size="md">
        <Icon name="save" className="text-icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
      <ButtonRow label="Large" size="lg">
        <Icon name="save" className="text-icon" />
        <span className="text-baseline-center">Save</span>
      </ButtonRow>
    </ComparisonGrid>

    <Heading as="h4" style={{ marginTop: '24px', marginBottom: '16px' }}>
      Icon Positions in Buttons
    </Heading>

    <ComparisonGrid>
      <ButtonRow label="Leading Icon" size="md">
        <Icon name="add" className="text-icon" />
        <span className="text-baseline-center">Add Item</span>
      </ButtonRow>
      <ButtonRow label="Trailing Icon" size="md">
        <span className="text-baseline-center">Next</span>
        <Icon name="arrow_forward" className="text-icon" />
      </ButtonRow>
      <ButtonRow
        label="Icon Only"
        size="md"
        style={{ padding: '8px' }}
        aria-label="Delete"
      >
        <Icon name="delete_to_trash" className="text-icon" />
      </ButtonRow>
      <ButtonRow label="Both Sides" size="md">
        <Icon name="star_outlined" className="text-icon" />
        <span className="text-baseline-center">Favorite</span>
        <Icon name="chevron_down" className="text-icon" />
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
          <Icon name="info_circle" className="text-icon" />
          <span className="text-baseline-center">Information message</span>
        </div>
      </ComparisonRow>
      <ComparisonRow>
        <Label>With Link</Label>
        <a
          href="https://example.com"
          className="font-family-ui text-md"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--eds-color-text-link)',
          }}
        >
          <Icon name="link" className="text-icon" />
          <span className="text-baseline-center">External link</span>
          <Icon name="external_link" className="text-icon" />
        </a>
      </ComparisonRow>
      <ComparisonRow>
        <Label>List Item</Label>
        <div
          className="font-family-ui text-md"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Icon name="check_circle_outlined" className="text-icon" />
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
          <Icon name="account_circle" className="text-icon" />
          <span className="text-baseline-center">John Doe</span>
          <Icon name="close" className="text-icon" />
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
    <GridShowcaseWrapper>
      <Heading as="h3" debug style={{ marginBottom: '16px' }}>
        Icon Alignment with Baseline Grid
      </Heading>
      <Paragraph debug style={{ marginBottom: '24px' }}>
        When icons are siblings to text with <code>text-baseline-center</code>,
        they maintain visual harmony with the baseline grid system. All spacing
        follows the 4px grid (8px, 12px, 16px, 20px, 24px).
      </Paragraph>

      <ShowcaseGrid>
        <ShowcaseCard>
          <CategoryHeader>
            <Label>Extra Small (xs)</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-xs" data-debug>
            <Icon name="check" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Extra small text
            </span>
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Small (sm)</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-sm" data-debug>
            <Icon name="check" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Small text with icon
            </span>
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Medium (md)</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-md" data-debug>
            <Icon name="info_circle" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Medium text with icon
            </span>
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Large (lg)</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-lg" data-debug>
            <Icon name="warning_outlined" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Large text with icon
            </span>
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Extra Large (xl)</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-xl" data-debug>
            <Icon name="star_filled" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Extra large text
            </span>
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Button Component</Label>
          </CategoryHeader>
          <Button $size="md" className="font-family-ui text-md" data-debug>
            <Icon name="save" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Save Document
            </span>
          </Button>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Icon Before & After</Label>
          </CategoryHeader>
          <ShowcaseItem className="font-family-ui text-md" data-debug>
            <Icon name="arrow_back" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Navigate
            </span>
            <Icon name="arrow_forward" className="text-icon" />
          </ShowcaseItem>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Badge/Chip Component</Label>
          </CategoryHeader>
          <div
            className="font-family-ui text-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#e3f2fd',
              borderRadius: '16px',
            }}
            data-debug
          >
            <Icon name="account_circle" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              User Badge
            </span>
            <Icon name="close" className="text-icon" />
          </div>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Link with Icons</Label>
          </CategoryHeader>
          <a
            href="https://example.com"
            className="font-family-ui text-md"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--eds-color-text-link)',
            }}
            data-debug
          >
            <Icon name="link" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              External Link
            </span>
            <Icon name="external_link" className="text-icon" />
          </a>
        </ShowcaseCard>

        <ShowcaseCard>
          <CategoryHeader>
            <Label>Status Indicator</Label>
          </CategoryHeader>
          <ShowcaseItem
            className="font-family-ui text-md"
            style={{ color: '#2e7d32' }}
            data-debug
          >
            <Icon name="check_circle_outlined" className="text-icon" />
            <span className="text-baseline-center" data-debug>
              Success state
            </span>
          </ShowcaseItem>
        </ShowcaseCard>
      </ShowcaseGrid>
    </GridShowcaseWrapper>
  </GridBackground>
)
IconAlignmentWithGrid.parameters = {
  docs: {
    description: {
      story:
        'Debug mode showing how icon and text siblings align to the baseline grid. The text-baseline-center class centers text within its container for optical alignment with icons. Grid layout with cards showcasing different sizes and patterns, all following the 4px grid system.',
    },
  },
}

export const UsageExamples: StoryFn = () => (
  <GridShowcaseWrapper>
    <Heading as="h3" style={{ marginBottom: '16px' }}>
      Usage Examples
    </Heading>
    <Paragraph style={{ marginBottom: '32px' }}>
      Practical examples organized by category, demonstrating common UI patterns
      with icons and text. All spacing follows the 4px grid system.
    </Paragraph>

    <UsageSection>
      <UsageCategory>
        <CategoryHeader>
          <Heading as="h4">Navigation Menu</Heading>
          <Paragraph size="sm" weight="lighter">
            Icons paired with text for navigation items
          </Paragraph>
        </CategoryHeader>
        <ShowcaseCard>
          <ShowcaseItem>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="home" className="text-icon" />
              <span className="text-baseline-center">Home</span>
            </a>
          </ShowcaseItem>
          <ShowcaseItem>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="dashboard" className="text-icon" />
              <span className="text-baseline-center">Dashboard</span>
            </a>
          </ShowcaseItem>
          <ShowcaseItem>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="settings" className="text-icon" />
              <span className="text-baseline-center">Settings</span>
            </a>
          </ShowcaseItem>
          <ShowcaseItem>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="library_books" className="text-icon" />
              <span className="text-baseline-center">Documentation</span>
            </a>
          </ShowcaseItem>
        </ShowcaseCard>
      </UsageCategory>

      <UsageCategory>
        <CategoryHeader>
          <Heading as="h4">Action Buttons</Heading>
          <Paragraph size="sm" weight="lighter">
            Common button patterns with leading and trailing icons
          </Paragraph>
        </CategoryHeader>
        <ShowcaseGrid>
          <ShowcaseCard>
            <Label>Primary Actions</Label>
            <Button $size="md" className="font-family-ui text-md">
              <Icon name="save" className="text-icon" />
              <span className="text-baseline-center">Save</span>
            </Button>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Secondary Actions</Label>
            <Button $size="md" className="font-family-ui text-md">
              <Icon name="file_description" className="text-icon" />
              <span className="text-baseline-center">Export</span>
            </Button>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Destructive Actions</Label>
            <Button $size="md" className="font-family-ui text-md">
              <Icon name="delete_to_trash" className="text-icon" />
              <span className="text-baseline-center">Delete</span>
            </Button>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Trailing Icon</Label>
            <Button $size="md" className="font-family-ui text-md">
              <span className="text-baseline-center">Share</span>
              <Icon name="share" className="text-icon" />
            </Button>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Navigation</Label>
            <Button $size="md" className="font-family-ui text-md">
              <span className="text-baseline-center">Next</span>
              <Icon name="arrow_forward" className="text-icon" />
            </Button>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Icon Only</Label>
            <Button
              $size="md"
              className="font-family-ui text-md"
              style={{ padding: '8px' }}
              aria-label="More options"
            >
              <Icon name="more_vertical" className="text-icon" />
            </Button>
          </ShowcaseCard>
        </ShowcaseGrid>
      </UsageCategory>

      <UsageCategory>
        <CategoryHeader>
          <Heading as="h4">Status Messages</Heading>
          <Paragraph size="sm" weight="lighter">
            Feedback messages with contextual icons and colors
          </Paragraph>
        </CategoryHeader>
        <ShowcaseGrid>
          <ShowcaseCard>
            <Label>Success</Label>
            <ShowcaseItem
              className="font-family-ui text-md"
              style={{ color: 'var(--eds-color-text-success-subtle)' }}
            >
              <Icon name="check_circle_outlined" className="text-icon" />
              <span className="text-baseline-center">
                Changes saved successfully
              </span>
            </ShowcaseItem>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Warning</Label>
            <ShowcaseItem
              className="font-family-ui text-md"
              style={{ color: 'var(--eds-color-text-warning-subtle)' }}
            >
              <Icon name="warning_outlined" className="text-icon" />
              <span className="text-baseline-center">
                Please review before submitting
              </span>
            </ShowcaseItem>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Error</Label>
            <ShowcaseItem
              className="font-family-ui text-md"
              style={{ color: 'var(--eds-color-text-danger-subtle)' }}
            >
              <Icon name="error_outlined" className="text-icon" />
              <span className="text-baseline-center">
                An error has occurred
              </span>
            </ShowcaseItem>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Information</Label>
            <ShowcaseItem
              className="font-family-ui text-md"
              style={{ color: 'var(--eds-color-text-info-subtle)' }}
            >
              <Icon name="info_circle" className="text-icon" />
              <span className="text-baseline-center">
                Updates available for download
              </span>
            </ShowcaseItem>
          </ShowcaseCard>
        </ShowcaseGrid>
      </UsageCategory>

      <UsageCategory>
        <CategoryHeader>
          <Heading as="h4">Interactive Elements</Heading>
          <Paragraph size="sm" weight="lighter">
            Links, list items, and chips with icon integration
          </Paragraph>
        </CategoryHeader>
        <ShowcaseGrid>
          <ShowcaseCard>
            <Label>External Link</Label>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="link" className="text-icon" />
              <span className="text-baseline-center">External link</span>
              <Icon name="external_link" className="text-icon" />
            </a>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Download Link</Label>
            <a
              href="https://example.com"
              className="font-family-ui text-md"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--eds-color-text-link)',
              }}
            >
              <Icon name="download" className="text-icon" />
              <span className="text-baseline-center">Download PDF</span>
            </a>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Checklist Item</Label>
            <ShowcaseItem className="font-family-ui text-md">
              <Icon name="check_circle_outlined" className="text-icon" />
              <span className="text-baseline-center">Task completed</span>
            </ShowcaseItem>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>User Badge</Label>
            <div
              className="font-family-ui text-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#e3f2fd',
                borderRadius: '16px',
              }}
            >
              <Icon name="account_circle" className="text-icon" />
              <span className="text-baseline-center">John Doe</span>
              <Icon name="close" className="text-icon" />
            </div>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>Tag/Category</Label>
            <div
              className="font-family-ui text-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#f3e5f5',
                borderRadius: '16px',
              }}
            >
              <Icon name="sun" className="text-icon" />
              <span className="text-baseline-center">Design System</span>
            </div>
          </ShowcaseCard>
          <ShowcaseCard>
            <Label>File Item</Label>
            <ShowcaseItem className="font-family-ui text-md">
              <Icon name="download" className="text-icon" />
              <span className="text-baseline-center">document.pdf</span>
            </ShowcaseItem>
          </ShowcaseCard>
        </ShowcaseGrid>
      </UsageCategory>
    </UsageSection>
  </GridShowcaseWrapper>
)
UsageExamples.parameters = {
  docs: {
    description: {
      story:
        'Practical examples of icons and text as siblings in common UI patterns, organized by category using CSS Grid. All spacing follows the 4px grid system (8px, 12px, 16px, 20px, 24px, 32px). Cards provide visual grouping and context for each example.',
    },
  },
}
