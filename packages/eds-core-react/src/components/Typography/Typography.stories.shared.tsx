import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { TypographyNext } from './Typography.new'
import type { TypographyNextProps } from './Typography.new.types'
import styled from 'styled-components'

// Constants
export const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog'
export const SIZES = [
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
export const WEIGHTS = ['lighter', 'normal', 'bolder'] as const
export const TRACKING_OPTIONS = ['tight', 'normal', 'wide'] as const
export const LINE_HEIGHTS = ['default', 'squished'] as const
export const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

// Styled Components
export const ComparisonGrid = styled.div`
  display: grid;
  gap: 24px;
  margin: 16px 0;
`

export const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px;
  background: #f7f7f7;
  border-radius: 4px;
  //
`

export const Label = styled(TypographyNext).attrs<Partial<TypographyNextProps>>(
  {
    family: 'ui',
    size: 'xs',
    weight: 'bolder',
    lineHeight: 'default',
    baseline: 'grid',
    // tracking: 'normal',
  },
)<Partial<TypographyNextProps>>`
  text-transform: uppercase;
  color: #666;
`

export const GridBackground = styled.div`
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

export const RealWorldGrid = styled.section`
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

export const IntroductionGrid = styled.section`
  display: grid;
  gap: 16px;

  & > h2 {
    margin-bottom: 4px;
  }
`

export const Button = styled.button<{ $size?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: #f5f5f5;
  }

  &:active {
    background: #e5e5e5;
  }
`

export const IconTextContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
`

export const ShowcaseCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

export const ShowcaseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`

export const UsageSection = styled.section`
  display: grid;
  gap: 32px;
  margin: 24px 0;
`

export const UsageCategory = styled.div`
  display: grid;
  gap: 16px;
`

export const CategoryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #dcdcdc;
`

export const GridShowcaseWrapper = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`

// Helper Components
export const ComparisonSection = ({
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

export const ComparisonRowItem = ({
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

export const HeadingLevelComparison = ({
  text = SAMPLE_TEXT,
}: {
  text?: string
}) => (
  <>
    {HEADING_LEVELS.map((level) => (
      <ComparisonRowItem key={level} label={level.toUpperCase()}>
        <Heading as={level}>{text}</Heading>
      </ComparisonRowItem>
    ))}
  </>
)

export const WeightComparison = ({
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
        {/* @ts-expect-error - componentProps may contain 'as' for Heading */}
        <Component {...componentProps} weight={weight}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

export const TrackingComparison = ({
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
        {/* @ts-expect-error - componentProps may contain 'as' for Heading */}
        <Component {...componentProps} tracking={tracking}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

export const SizeComparison = ({
  component: Component,
  text = SAMPLE_TEXT,
  ...componentProps
}: {
  component: typeof Paragraph
  text?: string
} & Record<string, unknown>) => (
  <>
    {SIZES.map((size) => (
      <ComparisonRowItem key={size} label={size.toUpperCase()}>
        <Component {...componentProps} size={size}>
          {text}
        </Component>
      </ComparisonRowItem>
    ))}
  </>
)

export const LineHeightComparison = ({
  text = SAMPLE_TEXT,
}: {
  text?: string
}) => (
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

export const ButtonRow = ({
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
    <Button $size={size} className={`font-ui text-${size}`} {...extraProps}>
      {children}
    </Button>
  </ComparisonRowItem>
)
