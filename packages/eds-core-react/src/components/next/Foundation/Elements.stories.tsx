import type { Meta, StoryObj } from '@storybook/react-vite'
import './elements.css'
import './typography.css'

type Args = {
  density: 'relaxed' | 'spacious' | 'comfortable'
}

const meta: Meta<Args> = {
  title: 'EDS 2.0 (beta)/Foundation/Elements',
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['relaxed', 'spacious', 'comfortable'],
      description: 'Density mode — sets `data-density` on the wrapper',
    },
  },
  args: {
    density: 'spacious',
  },
}

export default meta

type Story = StoryObj<Args>

const SPHINX = 'Sphinx of black quartz, judge my vow.'

// ===== Headings =====

export const Headings: Story = {
  render: ({ density }) => (
    <div data-density={density}>
      <h1>{SPHINX}</h1>
      <h2>{SPHINX}</h2>
      <h3>{SPHINX}</h3>
      <h4>{SPHINX}</h4>
      <h5>{SPHINX}</h5>
      <h6>{SPHINX}</h6>
    </div>
  ),
}

// ===== Heading Style Overrides =====

export const HeadingStyleOverrides: Story = {
  render: ({ density }) => (
    <div data-density={density}>
      <h2 className="eds-heading-1">{SPHINX}</h2>
      <h3 className="eds-heading-2">{SPHINX}</h3>
      <h4 className="eds-heading-3">{SPHINX}</h4>
      <h5 className="eds-heading-4">{SPHINX}</h5>
      <h6 className="eds-heading-5">{SPHINX}</h6>
      <p className="eds-heading-6">{SPHINX}</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `.eds-heading-1` through `.eds-heading-6` to apply heading styles independently of the element. The semantic element (`h1`–`h6`) controls document structure; the class controls visual appearance.',
      },
    },
  },
}

// ===== Body Text =====

export const BodyText: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <p>
        {SPHINX} {SPHINX} {SPHINX}
      </p>
      <blockquote>
        {SPHINX} {SPHINX}
      </blockquote>
      <figure>
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'%3E%3Crect width='200' height='80' fill='%23e0e0e0'/%3E%3C/svg%3E"
          alt="Placeholder"
          width={200}
          height={80}
        />
        <figcaption>{SPHINX}</figcaption>
      </figure>
      <address>{SPHINX}</address>
    </div>
  ),
}

// ===== Inline Text =====

export const InlineText: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <p>
        <strong>Strong:</strong> {SPHINX}
      </p>
      <p>
        <em>Emphasis:</em> {SPHINX}
      </p>
      <p>
        <small>Small:</small> {SPHINX}
      </p>
      <p>
        <s>Strikethrough:</s> {SPHINX}
      </p>
      <p>
        <del>Deleted:</del> <ins>Inserted:</ins> {SPHINX}
      </p>
      <p>
        <mark>Marked:</mark> {SPHINX}
      </p>
      <p>
        <abbr title="Sphinx of black quartz, judge my vow">Abbr:</abbr> {SPHINX}
      </p>
      <p>
        <cite>Cite:</cite> {SPHINX}
      </p>
      <p>
        <q>{SPHINX}</q>
      </p>
      <p>
        Text with sub<sub>script</sub> and sup<sup>erscript</sup>
      </p>
      <p>
        <time dateTime="2026-01-01">1 January 2026</time> — {SPHINX}
      </p>
    </div>
  ),
}

// ===== Code / Monospace =====

export const Code: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <p>
        Inline <code>code</code> within a paragraph.
      </p>
      <pre>{`function sphinx() {\n  return 'Sphinx of black quartz, judge my vow.'\n}`}</pre>
      <p>
        Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette.
      </p>
      <p>
        Output: <samp>Sphinx of black quartz, judge my vow.</samp>
      </p>
    </div>
  ),
}

// ===== Table Text =====

export const TableText: Story = {
  render: ({ density }) => (
    <div data-density={density}>
      <table data-color-appearance="neutral">
        <caption data-vertical-space="md">Table caption — {SPHINX}</caption>
        <thead>
          <tr>
            <th data-space-proportions="squared" data-selectable-space="md">
              Header one
            </th>
            <th data-space-proportions="squared" data-selectable-space="md">
              Header two
            </th>
            <th data-space-proportions="squared" data-selectable-space="md">
              Header three
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-space-proportions="squared" data-selectable-space="md">
              Sphinx
            </td>
            <td data-space-proportions="squared" data-selectable-space="md">
              of black quartz
            </td>
            <td data-space-proportions="squared" data-selectable-space="md">
              judge my vow
            </td>
          </tr>
          <tr>
            <td data-space-proportions="squared" data-selectable-space="md">
              Sphinx
            </td>
            <td data-space-proportions="squared" data-selectable-space="md">
              of black quartz
            </td>
            <td data-space-proportions="squared" data-selectable-space="md">
              judge my vow
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
}

// ===== Lists =====

export const Lists: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <ul>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
      </ul>
      <ol>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
      </ol>
      <dl>
        <dt>Sphinx</dt>
        <dd>{SPHINX}</dd>
        <dt>Black quartz</dt>
        <dd>{SPHINX}</dd>
      </dl>
    </div>
  ),
}

// ===== Form Labels =====

export const FormLabels: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <div>
        <label htmlFor="input-example">Label — {SPHINX}</label>
        <input id="input-example" type="text" placeholder={SPHINX} />
      </div>
      <fieldset style={{ marginTop: 16 }}>
        <legend>Legend — {SPHINX}</legend>
        <label>
          <input type="radio" name="example" /> {SPHINX}
        </label>
        <label>
          <input type="radio" name="example" /> {SPHINX}
        </label>
      </fieldset>
    </div>
  ),
}

// ===== All Elements =====

export const AllElements: Story = {
  render: ({ density }) => (
    <div data-density={density} style={{ maxWidth: 640 }}>
      <h1>h1 — {SPHINX}</h1>
      <h2>h2 — {SPHINX}</h2>
      <h3>h3 — {SPHINX}</h3>
      <h4>h4 — {SPHINX}</h4>
      <h5>h5 — {SPHINX}</h5>
      <h6>h6 — {SPHINX}</h6>

      <p>
        {SPHINX} {SPHINX} {SPHINX}
      </p>

      <blockquote>{SPHINX}</blockquote>

      <ul>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
      </ul>

      <ol>
        <li>{SPHINX}</li>
        <li>{SPHINX}</li>
      </ol>

      <dl>
        <dt>Sphinx</dt>
        <dd>{SPHINX}</dd>
      </dl>

      <table>
        <caption>{SPHINX}</caption>
        <thead>
          <tr>
            <th>Header one</th>
            <th>Header two</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sphinx</td>
            <td>of black quartz</td>
          </tr>
        </tbody>
      </table>

      <p>
        Inline <code>code</code>, <strong>strong</strong>, <em>emphasis</em>,{' '}
        <small>small</small>, <mark>mark</mark>, <s>strike</s>, <del>del</del>{' '}
        <ins>ins</ins>, <abbr title={SPHINX}>abbr</abbr>, sub<sub>script</sub>,
        sup<sup>erscript</sup>
      </p>

      <pre>{`function sphinx() {\n  return '${SPHINX}'\n}`}</pre>

      <p>
        Press <kbd>Ctrl</kbd> + <kbd>K</kbd>
      </p>
    </div>
  ),
}
