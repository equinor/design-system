import { Meta, StoryFn } from '@storybook/react-vite'
import { Text, Heading, Paragraph, Span } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
}

export default meta

export const Sizes: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Text size="xs">Extra small text (xs)</Text>
    <Text size="sm">Small text (sm)</Text>
    <Text size="md">Medium text (md)</Text>
    <Text size="lg">Large text (lg)</Text>
    <Text size="xl">Extra large text (xl)</Text>
    <Text size="2xl">2xl text</Text>
    <Text size="3xl">3xl text</Text>
    <Text size="4xl">4xl text</Text>
    <Text size="5xl">5xl text</Text>
    <Text size="6xl">6xl text</Text>
  </div>
)

export const LineHeights: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
    <div>
      <h3>Default Line Height</h3>
      <Text size="lg" lineHeight="default">
        This is text with default line height. It provides comfortable reading
        with more vertical space. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit.
      </Text>
    </div>
    <div>
      <h3>Squished Line Height</h3>
      <Text size="lg" lineHeight="squished">
        This is text with squished line height. It's more compact and takes less
        vertical space. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
    </div>
  </div>
)

export const BaselineAlignment: StoryFn<typeof Text> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      background:
        'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
    }}
  >
    <Text size="lg" baseline="grid">
      Text aligned to baseline grid (4px)
    </Text>
    <Text size="lg" baseline="center">
      Text with centered baseline
    </Text>
    <Text size="md" baseline="grid">
      Medium text on baseline grid
    </Text>
  </div>
)

export const FontWeights: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Text size="lg" weight="lighter">
      Lighter weight text (300)
    </Text>
    <Text size="lg" weight="normal">
      Normal weight text (400)
    </Text>
    <Text size="lg" weight="bolder">
      Bolder weight text (600)
    </Text>
  </div>
)

export const Combined: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Text size="3xl" lineHeight="default" baseline="grid" weight="bolder">
      Large, bold text on baseline grid
    </Text>
    <Text size="md" lineHeight="squished" baseline="grid" weight="normal">
      Medium, normal text with squished line height
    </Text>
    <Text size="sm" lineHeight="default" baseline="center" weight="lighter">
      Small, light text with centered baseline
    </Text>
  </div>
)

export const Variants: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Text variant="h1">Heading 1</Text>
    <Text variant="h2">Heading 2</Text>
    <Text variant="h3">Heading 3</Text>
    <Text variant="h4">Heading 4</Text>
    <Text variant="h5">Heading 5</Text>
    <Text variant="h6">Heading 6</Text>
    <Text variant="body-large">Body Large Text</Text>
    <Text variant="body">Body Text</Text>
    <Text variant="body-small">Body Small Text</Text>
    <Text variant="caption">Caption Text</Text>
    <Text variant="overline">Overline Text</Text>
  </div>
)

export const Headings: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Heading as="h1" size="6xl" weight="bolder" baseline="grid">
      Heading 1 (h1)
    </Heading>
    <Heading as="h2" size="5xl" weight="bolder" baseline="grid">
      Heading 2 (h2)
    </Heading>
    <Heading as="h3" size="4xl" weight="bolder" baseline="grid">
      Heading 3 (h3)
    </Heading>
    <Heading as="h4" size="3xl" weight="bolder" baseline="grid">
      Heading 4 (h4)
    </Heading>
    <Heading as="h5" size="2xl" weight="bolder" baseline="grid">
      Heading 5 (h5)
    </Heading>
    <Heading as="h6" size="xl" weight="bolder" baseline="grid">
      Heading 6 (h6)
    </Heading>
  </div>
)

export const Paragraphs: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Paragraph size="lg" baseline="grid">
      This is a large paragraph. Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
    </Paragraph>
    <Paragraph size="md" baseline="grid">
      This is a medium paragraph. Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
    </Paragraph>
    <Paragraph size="sm" baseline="grid">
      This is a small paragraph. Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
    </Paragraph>
  </div>
)

export const InlineText: StoryFn<typeof Text> = () => (
  <Paragraph size="md">
    This is a paragraph with <Span weight="bolder">bold inline text</Span> and{' '}
    <Span size="lg" weight="lighter">
      larger lighter text
    </Span>{' '}
    mixed together.
  </Paragraph>
)

export const Debug: StoryFn<typeof Text> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      background:
        'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
    }}
  >
    <Text size="3xl" baseline="grid" debug>
      Text with debug mode enabled
    </Text>
    <Text size="lg" baseline="grid" debug>
      Shows the text box boundaries
    </Text>
    <Text size="md" baseline="center" debug>
      Helps visualize alignment
    </Text>
  </div>
)

export const ButtonAlignment: StoryFn<typeof Text> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      background:
        'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
      padding: '20px',
    }}
  >
    <div>
      <h3>Baseline Grid (aligns to 4px grid)</h3>
      <button
        style={{
          padding: '12px 24px',
          background: 'transparent',
          color: '#000',
          border: '2px solid #007079',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <Text size="md" baseline="grid" debug>
          Button Text Grid
        </Text>
      </button>
    </div>

    <div>
      <h3>Baseline Center (vertically centered)</h3>
      <button
        style={{
          padding: '12px 24px',
          background: 'transparent',
          color: '#000',
          border: '2px solid #007079',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <Text size="md" baseline="center" debug>
          Button Text Center
        </Text>
      </button>
    </div>

    <div>
      <h3>Comparison Side by Side</h3>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#000',
            border: '2px solid #007079',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <Text size="md" baseline="grid" debug>
            Grid - Click me
          </Text>
        </button>
        <button
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#000',
            border: '2px solid #007079',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <Text size="md" baseline="center" debug>
            Center - Click me
          </Text>
        </button>
      </div>
      <p style={{ marginTop: '12px', fontSize: '14px', color: '#6f6f6f' }}>
        Notice how <strong>baseline-center</strong> provides better visual
        balance within the button container, while{' '}
        <strong>baseline-grid</strong> aligns to the external 4px grid system.
      </p>
    </div>
  </div>
)

export const TypographicHierarchy: StoryFn<typeof Text> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Heading as="h1" size="6xl" weight="bolder" baseline="grid">
      Design System Typography
    </Heading>
    <Paragraph size="lg" baseline="grid">
      A comprehensive typography system that maintains a consistent 4px baseline
      grid throughout the interface.
    </Paragraph>
    <Heading as="h2" size="4xl" weight="bolder" baseline="grid">
      Key Features
    </Heading>
    <Paragraph size="md" baseline="grid">
      The typography system includes multiple size variants, line height
      options, and baseline alignment strategies. Each element is designed to
      work harmoniously within the grid system.
    </Paragraph>
    <Heading as="h3" size="3xl" weight="bolder" baseline="grid">
      Usage Guidelines
    </Heading>
    <Paragraph size="md" baseline="grid">
      Use the <Span weight="bolder">size</Span> prop to control text size,{' '}
      <Span weight="bolder">lineHeight</Span> for spacing between lines, and{' '}
      <Span weight="bolder">baseline</Span> for alignment strategy.
    </Paragraph>
    <Text variant="caption">
      Caption text provides supplementary information
    </Text>
  </div>
)

export const AllVariants: StoryFn<typeof Text> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      background:
        'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
      padding: '20px',
    }}
  >
    <section>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 className="h1">Heading Variants (Composite Classes)</h2>
        <div className="h1">H1 - 48px / 56px / 600</div>
        <div className="h2">H2 - 40px / 48px / 600</div>
        <div className="h3">H3 - 32px / 40px / 600</div>
        <div className="h4">H4 - 24px / 32px / 600</div>
        <div className="h5">H5 - 20px / 28px / 600</div>
        <div className="h6">H6 - 18px / 28px / 600</div>
      </div>
    </section>
    <section>
      <h2>Body Text Variants</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="body-large">
          Body Large - 16px / 24px / 400 - Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </div>
        <div className="body">
          Body - 14px / 20px / 400 - Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </div>
        <div className="body-small">
          Body Small - 12px / 16px / 400 - Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </div>
        <div className="caption">
          Caption - 10.5px / 16px / 400 - Supplementary information text
        </div>
        <div className="overline">
          OVERLINE - 12PX / 16PX / 600 - UPPERCASE LABELS
        </div>
      </div>
    </section>
  </div>
)
