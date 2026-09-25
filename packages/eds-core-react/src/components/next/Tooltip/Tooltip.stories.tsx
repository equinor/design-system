import type { CSSProperties } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Button } from '../Button'
import { Tooltip, type TooltipProps } from '.'

const meta: Meta<typeof Tooltip> = {
  title: 'EDS 2.0 (beta)/Data Display/Tooltip',
  component: Tooltip,
  tags: ['beta'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

Uses the native [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (\`popover="hint"\`)
and [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
for zero-JS positioning. When the preferred side does not fit in the viewport, the tooltip falls back to
the opposite side and then to the two perpendicular sides via \`@position-try\` — it is never shifted
sideways, so the arrow always points at the trigger.

**Browser support:** CSS Anchor Positioning is [Baseline 2026](https://caniuse.com/css-anchor-positioning) (Chrome 125+, Firefox 135+, Safari 18.2+).
\`popover="hint"\` is supported in Chrome and Firefox; Safari falls back to \`popover="manual"\` — the tooltip still works, it just won't get free Escape-dismiss until Safari ships \`hint\` support.

\`\`\`tsx
import { Tooltip } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    title: {
      description:
        'Text displayed inside the tooltip bubble. Should be plain text.',
      control: 'text',
    },
    placement: {
      description:
        'Preferred placement relative to the anchor. If that side does not fit in the viewport, the tooltip falls back to the opposite side, then to the perpendicular sides.',
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    disabled: {
      description:
        'When true, the tooltip is not rendered and children are returned unwrapped.',
      control: 'boolean',
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
  placement: 'bottom',
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

const corners: Array<[string, CSSProperties]> = [
  ['Top left', { top: 4, left: 4 }],
  ['Top right', { top: 4, right: 4 }],
  ['Bottom left', { bottom: 4, left: 4 }],
  ['Bottom right', { bottom: 4, right: 4 }],
]

export const ViewportEdges: StoryFn<TooltipProps> = () => (
  <>
    {corners.map(([label, style]) => (
      <div key={label} style={{ position: 'fixed', ...style }}>
        <Tooltip title="A tooltip label that is wider than its trigger">
          <Button>{label}</Button>
        </Tooltip>
      </div>
    ))}
  </>
)

ViewportEdges.parameters = {
  layout: 'fullscreen',
  docs: {
    description: {
      story:
        'Triggers in the corners of the viewport. The default `bottom` placement does not fit centred, so the tooltip falls back to a free side instead of being shifted sideways. The arrow keeps pointing at the trigger. Note: `tests/visual/Tooltip.next.spec.ts` asserts the geometry of this story; changing the labels or positions will affect those tests.',
    },
  },
}
