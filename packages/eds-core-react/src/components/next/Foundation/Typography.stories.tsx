import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import page from './Typography.docs.mdx'
import './typography.stories.css'

type Role = 'header' | 'label' | 'body'
type Weight = 'normal' | 'medium' | 'bold'
type Density = 'compact' | 'comfortable' | 'relaxed'

type SpecimenArgs = {
  density: Density
}

const DENSITIES: Density[] = ['compact', 'comfortable', 'relaxed']

/** The steps each role has, in scale order (ADR-0027 point 6). */
const STEPS: Record<Role, string[]> = {
  header: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
  label: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
  body: ['sm', 'md', 'lg', 'xl', '2xl', '3xl'],
}

/** Equinor for header, Inter for label and body. */
const FAMILY: Record<Role, 'header' | 'ui'> = {
  header: 'header',
  label: 'ui',
  body: 'ui',
}

/** The weight each role uses when nothing else is asked for. */
const DEFAULT_WEIGHT: Record<Role, Weight> = {
  header: 'medium',
  label: 'normal',
  body: 'normal',
}

/** Body gets two sentences, so its line height has more than one line to show on. */
const SAMPLE: Record<Role, string> = {
  header: 'Well integrity review',
  label: 'Pipeline pressure',
  body: 'The north manifold is due for inspection. Two valves showed wear at the last visit, so they are first on the list.',
}

/** The four declarations of a text style, each from its own token. */
const textStyle = (
  role: Role,
  step: string,
  weight: Weight,
): CSSProperties => ({
  fontFamily: `var(--eds-font-family-${FAMILY[role]})`,
  fontSize: `var(--eds-typography-${role}-${step}-font-size)`,
  lineHeight: `var(--eds-typography-${role}-${step}-line-height)`,
  fontWeight: `var(--eds-font-weight-${weight})`,
})

const WEIGHT_ROWS: { role: Role; weight: Weight }[] = [
  { role: 'header', weight: 'medium' },
  { role: 'label', weight: 'normal' },
  { role: 'label', weight: 'medium' },
  { role: 'label', weight: 'bold' },
  { role: 'body', weight: 'normal' },
  { role: 'body', weight: 'bold' },
]

const WELL_STATUS =
  'Producing. Pressure has been within range since the valve on the north manifold was replaced.'

const FIGURES = [
  { label: 'Wellhead pressure', value: '312 bar' },
  { label: 'Water cut', value: '18%' },
  { label: 'Wells producing', value: '14 of 16' },
]

const meta: Meta = {
  title: 'Beta/Foundation/Typography',
  parameters: {
    docs: { page },
  },
}

export default meta

type Story = StoryObj
type SpecimenStory = StoryObj<SpecimenArgs>

const specimenControls: Pick<SpecimenStory, 'args' | 'argTypes'> = {
  args: { density: 'comfortable' },
  argTypes: {
    density: {
      control: 'inline-radio',
      options: DENSITIES,
      description:
        'Sets `data-density` on the wrapper. Comfortable is the default, used where no attribute is set.',
    },
  },
}

const RoleSpecimen = ({
  typeRole: role,
  density,
}: {
  typeRole: Role
  density: Density
}) => (
  <div className="typography-demo" data-density={density}>
    <div className="specimen">
      {STEPS[role].map((step) => (
        <Fragment key={step}>
          <p className="legend">
            {role}.{step}
          </p>
          <p
            className="sample"
            style={textStyle(role, step, DEFAULT_WEIGHT[role])}
          >
            {SAMPLE[role]}
          </p>
        </Fragment>
      ))}
    </div>
  </div>
)

const WellRow = () => (
  <div className="well">
    <span className="well-name">31/2-A-14</span>
    <span className="well-status">{WELL_STATUS}</span>
    <span className="well-inspected">Inspected two weeks ago</span>
  </div>
)

// ===== Roles and weights =====

export const HeaderRole: SpecimenStory = {
  ...specimenControls,
  render: ({ density }) => <RoleSpecimen typeRole="header" density={density} />,
}

export const LabelRole: SpecimenStory = {
  ...specimenControls,
  render: ({ density }) => <RoleSpecimen typeRole="label" density={density} />,
}

export const BodyRole: SpecimenStory = {
  ...specimenControls,
  render: ({ density }) => <RoleSpecimen typeRole="body" density={density} />,
}

export const Weights: Story = {
  render: () => (
    <div className="typography-demo">
      <div className="specimen">
        {WEIGHT_ROWS.map(({ role, weight }) => (
          <Fragment key={`${role}-${weight}`}>
            <p className="legend">
              {role}.lg, {weight}
            </p>
            <p className="sample" style={textStyle(role, 'lg', weight)}>
              {SAMPLE[role]}
            </p>
          </Fragment>
        ))}
      </div>
    </div>
  ),
}

// ===== Worked examples from the Using typography page =====

export const AlwaysSetThePair: Story = {
  render: () => (
    <div className="typography-demo columns">
      <div className="column">
        <p className="legend">Font size and line height from label.sm</p>
        <div className="running-text">
          <p>
            Pressure on the north manifold has been within range since the valve
            was replaced. The chart shows the last day.
          </p>
          <p className="caption">Wellhead pressure, last 24 hours</p>
        </div>
      </div>
      <div className="column">
        <p className="legend">Font size only</p>
        <div className="running-text">
          <p>
            Pressure on the north manifold has been within range since the valve
            was replaced. The chart shows the last day.
          </p>
          <p className="size-only">Wellhead pressure, last 24 hours</p>
        </div>
      </div>
    </div>
  ),
}

export const Hierarchy: Story = {
  render: () => (
    <div className="typography-demo">
      <WellRow />
    </div>
  ),
}

export const PageComposition: Story = {
  render: () => (
    <div className="typography-demo overview">
      <div className="app-bar">
        <span className="app-name">Production monitor</span>
      </div>
      <h1 className="page-title">Field overview</h1>
      <p className="ingress">
        Production and well status for the last 24 hours, updated every five
        minutes.
      </p>
      <div className="tiles">
        {FIGURES.map(({ label, value }) => (
          <div className="tile" key={label}>
            <span className="figure-label">{label}</span>
            <span className="figure">{value}</span>
          </div>
        ))}
      </div>
      <h2 className="section-heading">Wells</h2>
      <p className="running-text">
        Fourteen of the sixteen wells are producing. The other two are shut in
        while their safety valves are replaced, and are due back in production
        next week.
      </p>
    </div>
  ),
}

export const LabelVersusBody: Story = {
  render: () => (
    <div className="typography-demo columns">
      <div className="column">
        <p className="legend">label.md</p>
        <p className="as-label">
          {WELL_STATUS} The next inspection is planned for the spring shutdown.
        </p>
      </div>
      <div className="column">
        <p className="legend">body.md</p>
        <p className="as-body">
          {WELL_STATUS} The next inspection is planned for the spring shutdown.
        </p>
      </div>
    </div>
  ),
}

export const HeadingLevelVersusSize: Story = {
  render: () => (
    <div className="typography-demo columns">
      <div className="column">
        <p className="legend">An h2 at header.3xl</p>
        <h2 className="section-heading">Production by well</h2>
      </div>
      <div className="column overview-page">
        <p className="legend">An h2 at header.4xl, on an overview page</p>
        <h2>Production by well</h2>
      </div>
    </div>
  ),
}

export const Density: Story = {
  render: () => (
    <div className="typography-demo columns">
      {DENSITIES.map((density) => (
        <div className="column" key={density}>
          <p className="legend">data-density=&quot;{density}&quot;</p>
          <div data-density={density}>
            <WellRow />
          </div>
        </div>
      ))}
    </div>
  ),
}
