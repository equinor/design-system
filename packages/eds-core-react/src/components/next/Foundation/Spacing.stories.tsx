import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import page from './Spacing.docs.mdx'
import './Spacing.stories.css'

const STEPS = [
  'none',
  '4xs',
  '3xs',
  '2xs',
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
  '7xl',
  '8xl',
  '9xl',
] as const

// rounded-outer is left out on purpose: it exists for Figma focus rings,
// and CSS derives the ring radius from border-radius and outline-offset.
const RADII = ['none', 'rounded', 'pill'] as const

const DENSITIES = ['compact', 'comfortable', 'relaxed'] as const

type Density = (typeof DENSITIES)[number]

type Args = {
  density: Density
}

// Comfortable is the default in the beta bundle (declared on :root), so the
// stories leave the attribute off for it instead of writing
// data-density="comfortable". Both give the same values.
const densityAttribute = (density: Density) =>
  density === 'comfortable' ? undefined : density

const densityLabel = (density: Density) =>
  density === 'comfortable'
    ? 'No attribute (Comfortable)'
    : `data-density="${density}"`

const densityArgTypes: Meta<Args>['argTypes'] = {
  density: {
    control: 'radio',
    options: DENSITIES,
    description:
      'Sets `data-density` on the story wrapper. Comfortable is the default, so the story sets no attribute for it.',
  },
}

type TokenValueProps = {
  /** The custom property to read, such as `--eds-spacing-md` */
  name: string
  /** The density the value sits in. It is only used to read the value
   * again when the density changes, because the attribute is set on an
   * ancestor that React does not track for this element. */
  density?: Density
}

/** Prints the value a custom property resolves to where this element sits. */
const TokenValue = ({ name, density }: TokenValueProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!ref.current) return
    setValue(getComputedStyle(ref.current).getPropertyValue(name).trim())
  }, [name, density])

  return (
    <span ref={ref} className="value">
      {value}
    </span>
  )
}

const meta: Meta<Args> = {
  title: 'EDS 2.0 (beta)/Foundation/Spacing',
  parameters: {
    docs: { page },
  },
}

export default meta

type Story = StoryObj<Args>

export const Steps: Story = {
  args: {
    density: 'comfortable',
  },
  argTypes: densityArgTypes,
  render: ({ density }) => (
    <div className="spacing-story" data-density={densityAttribute(density)}>
      <ul className="steps">
        {STEPS.map((step) => (
          <li key={step} className="step">
            <code>--eds-spacing-{step}</code>
            <span
              className="bar"
              aria-hidden="true"
              style={{ inlineSize: `var(--eds-spacing-${step})` }}
            />
            <TokenValue name={`--eds-spacing-${step}`} density={density} />
          </li>
        ))}
      </ul>
    </div>
  ),
}

export const Densities: Story = {
  render: () => (
    <div className="spacing-story densities">
      {DENSITIES.map((density) => (
        <figure
          key={density}
          className="density"
          data-density={densityAttribute(density)}
        >
          <figcaption>
            <code>{densityLabel(density)}</code>
          </figcaption>
          <div className="card">
            <p className="title">Pressure readings</p>
            <p className="text">
              Padding <code>--eds-spacing-md</code> is{' '}
              <TokenValue name="--eds-spacing-md" density={density} />, and the
              gap <code>--eds-spacing-sm</code> is{' '}
              <TokenValue name="--eds-spacing-sm" density={density} />.
            </p>
            <div className="actions">
              <Button variant="primary">Open</Button>
              <Button variant="secondary">Dismiss</Button>
            </div>
          </div>
        </figure>
      ))}
    </div>
  ),
}

export const InCss: Story = {
  name: 'Using the steps in CSS',
  render: () => (
    <div className="spacing-story">
      <article className="card">
        <p className="title">Pressure readings</p>
        <p className="text">Updated twelve minutes ago from 48 sensors.</p>
        <p className="notice">Two sensors have not reported since yesterday.</p>
        <div className="actions">
          <Button variant="primary">Open report</Button>
          <Button variant="secondary">Dismiss</Button>
        </div>
      </article>
    </div>
  ),
}

export const CornerRadius: Story = {
  args: {
    density: 'comfortable',
  },
  argTypes: densityArgTypes,
  render: ({ density }) => (
    <div
      className="spacing-story radii"
      data-density={densityAttribute(density)}
    >
      {RADII.map((radius) => (
        <figure key={radius} className="radius">
          <span
            className="shape"
            aria-hidden="true"
            style={{ borderRadius: `var(--eds-corner-radius-${radius})` }}
          />
          <figcaption>
            <code>--eds-corner-radius-{radius}</code>
            <TokenValue
              name={`--eds-corner-radius-${radius}`}
              density={density}
            />
          </figcaption>
        </figure>
      ))}
    </div>
  ),
}
