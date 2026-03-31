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

Uses the native [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (\`popover="hint"\`)
and [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
for zero-JS positioning with automatic viewport-edge flipping via \`@position-try\`.

**Browser support:** CSS Anchor Positioning is [Baseline 2025](https://caniuse.com/css-anchor-positioning) (Chrome 125+, Firefox 135+, Safari 18.2+).
\`popover="hint"\` is supported in Chrome and Firefox; Safari falls back to \`popover="manual"\` — the tooltip still works, it just won't get free Escape-dismiss until Safari ships \`hint\` support.

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

export const FlipTest: StoryFn<TooltipProps> = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '1fr 1fr 1fr',
      padding: '0.5rem',
      boxSizing: 'border-box',
    }}
  >
    {/* Corners */}
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <Tooltip title="placement=top, should flip to bottom" placement="top">
        <Button>↖ top</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="placement=top, stays top" placement="top">
        <Button>↑ top</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
      }}
    >
      <Tooltip title="placement=top, should flip to bottom" placement="top">
        <Button>↗ top</Button>
      </Tooltip>
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Tooltip title="placement=left, should flip to right" placement="left">
        <Button>← left</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="Center — no flip needed" placement="top">
        <Button>center</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Tooltip title="placement=right, should flip to left" placement="right">
        <Button>right →</Button>
      </Tooltip>
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
      }}
    >
      <Tooltip title="placement=bottom, should flip to top" placement="bottom">
        <Button>↙ bottom</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="placement=bottom, stays bottom" placement="bottom">
        <Button>↓ bottom</Button>
      </Tooltip>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <Tooltip title="placement=bottom, should flip to top" placement="bottom">
        <Button>↘ bottom</Button>
      </Tooltip>
    </div>
  </div>
)

FlipTest.parameters = { layout: 'fullscreen' }

export const TopBottomFlipTest: StoryFn<TooltipProps> = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '0.5rem',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Tooltip title="placement=top, should flip to bottom" placement="top">
        <Button>↑ top (near top edge)</Button>
      </Tooltip>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Tooltip title="placement=top, no flip needed" placement="top">
        <Button>top (center)</Button>
      </Tooltip>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Tooltip title="placement=bottom, should flip to top" placement="bottom">
        <Button>↓ bottom (near bottom edge)</Button>
      </Tooltip>
    </div>
  </div>
)

TopBottomFlipTest.parameters = { layout: 'fullscreen' }

export const LeftRightFlipTest: StoryFn<TooltipProps> = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: '4rem 0.5rem',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4rem',
      }}
    >
      <Tooltip title="placement=left, should flip to right" placement="left">
        <Button>← left (near left edge)</Button>
      </Tooltip>
      <Tooltip title="placement=right, should flip to left" placement="right">
        <Button>right (near right edge) →</Button>
      </Tooltip>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Tooltip title="placement=right, no flip needed" placement="right">
        <Button>right (center)</Button>
      </Tooltip>
    </div>
  </div>
)

LeftRightFlipTest.parameters = { layout: 'fullscreen' }

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
