import type { CSSProperties } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { add } from '@equinor/eds-icons'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Tooltip, type TooltipProps } from '.'
import page from './Tooltip.docs.mdx'

const meta: Meta<typeof Tooltip> = {
  title: 'Beta/Data Display/Tooltip',
  component: Tooltip,
  tags: ['beta'],
  parameters: {
    layout: 'centered',
    docs: {
      page,
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

export const Overview: StoryFn<TooltipProps> = () => (
  <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
    <Tooltip title="Save the draft">
      <Button>Save</Button>
    </Tooltip>
    <Tooltip title="Add item">
      <Button icon aria-label="Add item">
        <Icon data={add} aria-hidden />
      </Button>
    </Tooltip>
  </div>
)

export const Placements: StoryFn<TooltipProps> = () => (
  <div style={{ display: 'flex', gap: '3rem', padding: '4rem' }}>
    {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
      <Tooltip key={placement} title="Label" placement={placement}>
        <Button>{placement}</Button>
      </Tooltip>
    ))}
  </div>
)
Placements.parameters = {
  docs: {
    description: {
      story:
        'Use `placement` to choose the preferred side: top, bottom, left or right. The default is bottom.',
    },
  },
}

export const Disabled: StoryFn<TooltipProps> = () => (
  <Tooltip title="You won't see this" disabled>
    <Button>Tooltip disabled</Button>
  </Tooltip>
)
Disabled.parameters = {
  docs: {
    description: {
      story:
        'A disabled Tooltip renders only its child, with no tooltip and no wrapper.',
    },
  },
}

export const LongContent: StoryFn<TooltipProps> = () => (
  <Tooltip title="This is a longer tooltip label" placement="bottom">
    <Button>Hover me</Button>
  </Tooltip>
)
LongContent.parameters = {
  docs: {
    description: {
      story:
        'The tooltip is as wide as its text, so a longer label gives a wider tooltip.',
    },
  },
}

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

// `tests/visual/Tooltip.next.spec.ts` asserts the geometry of this story, so
// changing the labels or positions affects those tests.
ViewportEdges.parameters = {
  layout: 'fullscreen',
  docs: {
    // The triggers use `position: fixed`, so the example runs in its own frame
    // and the corners are the frame's corners, not the docs page's.
    story: { inline: false, iframeHeight: 320 },
    description: {
      story:
        'Triggers in the corners of the viewport. The default `bottom` placement does not fit centred, so the tooltip falls back to a free side instead of being shifted sideways, and the arrow keeps pointing at the trigger.',
    },
  },
}
