import Layout from '@theme/Layout'

import type { JSX } from 'react'

import { Hero } from '@site/src/components/Hero'
import { DocsSection } from '@site/src/components/DocsSection'
import { StatusChip } from '@site/src/components/StatusChip'

// TODO: make this table automatic in future. Storybook URLs are hand-written on
// purpose here (this page links to stories, it does not embed them), so the
// showLink / StoryCanvas convention does not apply. A future generator can
// derive the ids with Storybook's toId, as check-story-references.mjs does.

const DOCS = '/docs/Next/components'
const SB = 'https://storybook.eds.equinor.com/?path=/docs'

type ChipStatus = 'planned' | 'in-progress' | 'beta' | 'stable' | 'deprecated'

type CellStatus = ChipStatus | 'none'

type ComponentRow = {
  name: string
  /** Component-docs path under /docs/Next/components, or null when unpublished. */
  doc: string | null
  latest: CellStatus
  beta: CellStatus
  /** Storybook story ids (without the `--docs` suffix) per version. */
  storybook: { latest?: string; beta?: string }
}

const COMPONENTS: ComponentRow[] = [
  {
    name: 'Accordion',
    doc: 'surfaces/accordion',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'surfaces-accordion' },
  },
  {
    name: 'Autocomplete',
    doc: 'inputs/autocomplete',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-autocomplete' },
  },
  {
    name: 'Avatar',
    doc: null,
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'data-display-avatar' },
  },
  {
    name: 'Badge',
    doc: null,
    latest: 'none',
    beta: 'in-progress',
    storybook: {},
  },
  {
    name: 'Banner',
    doc: 'feedback/banner',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'feedback-banner' },
  },
  {
    name: 'Breadcrumb',
    doc: null,
    latest: 'stable',
    beta: 'planned',
    storybook: { latest: 'navigation-breadcrumbs' },
  },
  {
    name: 'Button',
    doc: 'inputs/button',
    latest: 'stable',
    beta: 'beta',
    storybook: { latest: 'inputs-button-button', beta: 'beta-inputs-button' },
  },
  {
    name: 'Cards',
    doc: null,
    latest: 'stable',
    beta: 'planned',
    storybook: { latest: 'surfaces-card' },
  },
  {
    name: 'Checkbox',
    doc: 'inputs/selection_controls',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-selection-controls-checkbox' },
  },
  {
    name: 'Chip',
    doc: 'data-display/chip',
    latest: 'stable',
    beta: 'beta',
    storybook: { latest: 'data-display-chips', beta: 'beta-data-display-chip' },
  },
  { name: 'ComboBox', doc: null, latest: 'none', beta: 'none', storybook: {} },
  {
    name: 'Dialog',
    doc: null,
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'feedback-dialog' },
  },
  {
    name: 'Divider',
    doc: 'surfaces/divider',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'data-display-divider' },
  },
  {
    name: 'Field',
    doc: 'inputs/field',
    latest: 'none',
    beta: 'in-progress',
    storybook: {},
  },
  {
    name: 'Icon',
    doc: 'data-display/icon',
    latest: 'stable',
    beta: 'beta',
    storybook: { latest: 'icons-icon', beta: 'beta-icon' },
  },
  {
    name: 'Input',
    doc: 'inputs/input',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-input' },
  },
  {
    name: 'Link',
    doc: 'navigation/link',
    latest: 'none',
    beta: 'in-progress',
    storybook: {},
  },
  {
    name: 'Menu',
    doc: null,
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'navigation-menu' },
  },
  {
    name: 'Radio button',
    doc: 'inputs/selection_controls',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-selection-controls-radio' },
  },
  {
    name: 'Search',
    doc: 'inputs/search',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-search' },
  },
  {
    name: 'Select',
    doc: null,
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-nativeselect' },
  },
  {
    name: 'Snackbar',
    doc: null,
    latest: 'stable',
    beta: 'planned',
    storybook: { latest: 'feedback-snackbar' },
  },
  {
    name: 'Switch',
    doc: 'inputs/selection_controls',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-selection-controls-switch' },
  },
  {
    name: 'Tab',
    doc: null,
    latest: 'stable',
    beta: 'planned',
    storybook: { latest: 'navigation-tabs' },
  },
  {
    name: 'Text Area',
    doc: 'inputs/textarea',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-textarea' },
  },
  {
    name: 'Text Field',
    doc: 'inputs/textfield',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'inputs-textfield' },
  },
  {
    name: 'Tooltip',
    doc: 'data-display/tooltip',
    latest: 'stable',
    beta: 'in-progress',
    storybook: { latest: 'data-display-tooltip' },
  },
]

const LEGEND: { status: ChipStatus; description: string }[] = [
  { status: 'planned', description: 'on the roadmap, not started' },
  { status: 'in-progress', description: 'being designed or built' },
  {
    status: 'beta',
    description:
      'shipped in the Beta, safe to adopt, API may still change before 3.0.0',
  },
  { status: 'stable', description: 'shipped in Latest, API stable' },
  { status: 'deprecated', description: 'scheduled for removal' },
]

function StatusCell({ status }: { status: CellStatus }): JSX.Element {
  if (status === 'none') return <>None</>
  return <StatusChip status={status} />
}

function StorybookCell({ row }: { row: ComponentRow }): JSX.Element {
  const links: JSX.Element[] = []
  if (row.storybook.latest) {
    links.push(
      <a
        key="latest"
        href={`${SB}/${row.storybook.latest}--docs`}
        aria-label={`${row.name} in Latest Storybook`}
      >
        Latest
      </a>,
    )
  }
  if (row.storybook.beta) {
    links.push(
      <a
        key="beta"
        href={`${SB}/${row.storybook.beta}--docs`}
        aria-label={`${row.name} in Beta Storybook`}
      >
        Beta
      </a>,
    )
  }
  return (
    <>
      {links.map((link, i) => (
        <span key={link.key}>
          {i > 0 && ' · '}
          {link}
        </span>
      ))}
    </>
  )
}

export default function ComponentsStatus(): JSX.Element {
  return (
    <Layout
      title="Components status"
      description="The maturity of each component across Latest and the Beta."
    >
      <main>
        <Hero
          title="Components status"
          dots
          lead={
            <p>
              How mature each component is, in <strong>Latest</strong> (
              <code>@equinor/eds-core-react</code> 2.x) and in the{' '}
              <strong>Beta</strong> (the 3.0.0 beta under{' '}
              <code>@equinor/eds-core-react/next</code>). A component often has
              a status in both at once: stable to use today in Latest, while its
              redesigned version is still being built for the Beta. Component
              names link to their documentation, and the Storybook column links
              to the live component in each version where one exists.
            </p>
          }
        />
        <DocsSection title="Status by component">
          <p>
            The table lists the components in the redesigned kit, so some stable
            Latest components outside that kit, such as Datepicker, Table,
            Pagination, Slider and TopBar, do not appear yet. Component names
            follow the EDS Core Components Figma file rather than the package
            exports. This table is maintained by hand from that Figma file while
            the automated status pipeline is being set up.
          </p>
          <ul>
            {LEGEND.map(({ status, description }) => (
              <li key={status}>
                <StatusChip status={status} /> {description}
              </li>
            ))}
          </ul>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Latest (2.x)</th>
                <th>Beta (3.0.0)</th>
                <th>Storybook</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((row) => (
                <tr key={row.name}>
                  <td>
                    {row.doc ? (
                      <a href={`${DOCS}/${row.doc}`}>{row.name}</a>
                    ) : (
                      row.name
                    )}
                  </td>
                  <td>
                    <StatusCell status={row.latest} />
                  </td>
                  <td>
                    <StatusCell status={row.beta} />
                  </td>
                  <td>
                    <StorybookCell row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DocsSection>
      </main>
    </Layout>
  )
}
