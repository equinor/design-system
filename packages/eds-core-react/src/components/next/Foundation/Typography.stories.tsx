import { Fragment } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import './typography.css'
import page from './Typography.docs.mdx'

type Args = {
  density: 'relaxed' | 'spacious' | 'comfortable'
  lineHeight: 'squished' | 'default'
}

const meta: Meta<Args> = {
  title: 'EDS 2.0 (beta)/Foundation/Typography',
  parameters: {
    docs: { page },
    controls: { expanded: true },
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['relaxed', 'spacious', 'comfortable'],
      description: 'Density mode — sets `data-density` on the wrapper',
    },
    lineHeight: {
      control: 'radio',
      options: ['squished', 'default'],
      description: 'Line-height scale',
    },
  },
  args: {
    density: 'spacious',
    lineHeight: 'squished',
  },
}

export default meta

type Story = StoryObj<Args>

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
const SPHINX = 'Sphinx of black quartz, judge my vow.'

const textBoxStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

  @supports (text-box: trim-both ex alphabetic) {
    .typo-centered {
      padding-top: var(--padding-top-centered);
      padding-bottom: var(--padding-bottom-centered);
      text-box: var(--text-box);
    }
    .typo-baseline {
      padding-top: var(--padding-top-baseline);
      padding-bottom: var(--padding-bottom-baseline);
      text-box: var(--text-box);
    }
  }
`

// ===== UI Text =====

export const UIText: Story = {
  args: {
    lineHeight: 'squished',
  },
  render: ({ density, lineHeight }) => (
    <div data-density={density} style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{textBoxStyles}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3rem 1fr 1fr',
          gap: '12px 32px',
          alignItems: 'baseline',
        }}
      >
        <span style={{ fontSize: 11, color: '#888' }}>size</span>
        <span style={{ fontSize: 11, color: '#888' }}>single line</span>
        <span style={{ fontSize: 11, color: '#888' }}>two lines</span>

        {sizes.map((size) => (
          <Fragment key={size}>
            <code style={{ fontSize: 11, color: '#888' }}>{size}</code>
            <p
              className="typo-centered"
              style={{
                margin: 0,
                fontSize: `var(--eds-typography-ui-body-${size}-font-size)`,
                lineHeight: `var(--eds-typography-ui-body-${size}-line-height-${lineHeight})`,
              }}
            >
              Save changes
            </p>
            <p
              className="typo-baseline"
              style={{
                margin: 0,
                fontSize: `var(--eds-typography-ui-body-${size}-font-size)`,
                lineHeight: `var(--eds-typography-ui-body-${size}-line-height-${lineHeight})`,
              }}
            >
              Save changes
              <br />
              to continue
            </p>
          </Fragment>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'UI text scale. Single-line uses centered text-box trimming; two-line uses baseline alignment.',
      },
    },
  },
}

// ===== Long-form Text =====

export const LongFormText: Story = {
  args: {
    lineHeight: 'default',
  },
  render: ({ density, lineHeight }) => (
    <div
      data-density={density}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 640,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{textBoxStyles}</style>
      {sizes.map((size) => (
        <div key={size} style={{ display: 'flex', gap: 24 }}>
          <code
            style={{
              fontSize: 11,
              color: '#888',
              flexShrink: 0,
              width: '3rem',
            }}
          >
            {size}
          </code>
          <p
            className="typo-baseline"
            style={{
              margin: 0,
              fontSize: `var(--eds-typography-ui-body-${size}-font-size)`,
              lineHeight: `var(--eds-typography-ui-body-${size}-line-height-${lineHeight})`,
            }}
          >
            {SPHINX} {SPHINX} {SPHINX}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Long-form text scale. Uses baseline text-box alignment.',
      },
    },
  },
}
