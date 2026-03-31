import type { Meta, StoryFn } from '@storybook/react-vite'
import { Button } from '../Button'
import { Tooltip, type TooltipProps } from '.'

const meta: Meta<typeof Tooltip> = {
  title: 'EDS 2.0 (beta)/Tooltip',
  component: Tooltip,
  tags: ['beta'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

Uses the native [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
and [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
for zero-JS positioning.

\`\`\`tsx
import { Tooltip } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Button>Hover me</Button>
  </Tooltip>
)

Introduction.args = {
  title: 'Tooltip text',
  placement: 'top',
}

export const Placements: StoryFn<TooltipProps> = () => (
  <div style={{ display: 'flex', gap: '3rem', padding: '4rem' }}>
    {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
      <Tooltip key={placement} title="Label" placement={placement}>
        <Button>{placement}</Button>
      </Tooltip>
    ))}
  </div>
)

export const Disabled: StoryFn<TooltipProps> = () => (
  <Tooltip title="You won't see this" disabled>
    <Button>Tooltip disabled</Button>
  </Tooltip>
)

export const LongContent: StoryFn<TooltipProps> = () => (
  <Tooltip title="This is a longer tooltip label" placement="bottom">
    <Button>Hover me</Button>
  </Tooltip>
)

export const SquareTrigger: StoryFn<TooltipProps> = () => (
  <div style={{ display: 'flex', gap: '3rem', padding: '4rem' }}>
    {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
      <Tooltip key={placement} title="Label" placement={placement}>
        <button style={{ borderRadius: 0, padding: '1rem 2rem' }}>
          {placement}
        </button>
      </Tooltip>
    ))}
  </div>
)
