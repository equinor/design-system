import type { Meta, StoryFn } from '@storybook/react-vite'
import {
  Avatar,
  AvatarNameLabel,
  type AvatarProps,
  type AvatarNameLabelProps,
} from '.'

const meta: Meta<typeof Avatar> = {
  title: 'EDS 2.0 (beta)/Data Display/Avatar',
  component: Avatar,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** — this component is under active development.

Displays a user's initial(s) in a circular badge. Use \`AvatarNameLabel\` to pair it with a name and metadata.

\`\`\`tsx
import { Avatar, AvatarNameLabel } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<AvatarProps> = (args) => <Avatar {...args} />
Introduction.args = {
  name: 'Ada Lovelace',
  size: 'lg',
  emphasis: 'low',
  notification: false,
}
Introduction.parameters = {
  docs: {
    description: {
      story:
        'Pass `name` to make the avatar accessible — initials are derived automatically and the avatar is announced to screen readers as `role="img"`. Without `name`, the initial is purely decorative. Inside `AvatarNameLabel` this is handled automatically from `fullName`.',
    },
  },
}

export const Sizes: StoryFn = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <Avatar initial="A" size="sm" />
    <Avatar initial="A" size="md" />
    <Avatar initial="A" size="lg" />
  </div>
)
Sizes.parameters = {
  docs: {
    description: {
      story: 'Three sizes: `sm` (16px), `md` (24px), `lg` (32px).',
    },
  },
}

export const Emphasis: StoryFn = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <Avatar initial="A" size="lg" emphasis="low" />
    <Avatar initial="A" size="lg" emphasis="high" />
  </div>
)
Emphasis.parameters = {
  docs: {
    description: {
      story:
        '`low` uses the muted accent background with dark text. `high` uses the emphasis accent background with white text.',
    },
  },
}

export const WithNotification: StoryFn = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <Avatar initial="A" size="sm" notification />
    <Avatar initial="A" size="md" notification />
    <Avatar initial="A" size="lg" notification />
    <Avatar initial="A" size="lg" emphasis="high" notification />
  </div>
)
WithNotification.parameters = {
  docs: {
    description: {
      story:
        'The `notification` prop adds a success-tone indicator dot at the bottom-right corner.',
    },
  },
}

export const AllCombinations: StoryFn = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    }}
  >
    {(['sm', 'md', 'lg'] as const).map((size) =>
      (['low', 'high'] as const).map((emphasis) => (
        <Avatar
          key={`${size}-${emphasis}`}
          initial="A"
          size={size}
          emphasis={emphasis}
        />
      )),
    )}
  </div>
)

export const NameLabelHorizontal: StoryFn<AvatarNameLabelProps> = (args) => (
  <AvatarNameLabel {...args} />
)
NameLabelHorizontal.args = {
  fullName: 'Ada Lovelace',
  meta: 'Senior Engineer',
  layout: 'horizontal',
}
NameLabelHorizontal.parameters = {
  docs: {
    description: {
      story:
        'Horizontal layout stacks the name and metadata vertically beside the avatar.',
    },
  },
}

export const NameLabelVertical: StoryFn<AvatarNameLabelProps> = (args) => (
  <AvatarNameLabel {...args} />
)
NameLabelVertical.args = {
  fullName: 'Ada Lovelace',
  meta: 'ada@equinor.com',
  layout: 'vertical',
}
NameLabelVertical.parameters = {
  docs: {
    description: {
      story:
        'Vertical layout places the name and metadata on the same line — compact for use in wider contexts like headers or nav.',
    },
  },
}

export const NameLabelEdgeCases: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6f6f6f' }}>
        Horizontal (default)
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '200px',
        }}
      >
        <AvatarNameLabel
          fullName="Bartholomew Featherstonehaugh"
          meta="Senior Petroleum Engineer"
        />
        <AvatarNameLabel
          fullName="Mary Jane Watson"
          meta="Reservoir Geoscientist"
        />
      </div>
    </div>
    <div>
      <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6f6f6f' }}>
        Vertical — designed for wider contexts (name + email on one line)
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AvatarNameLabel
          layout="vertical"
          fullName="Bartholomew Featherstonehaugh"
          meta="Senior Petroleum Engineer"
        />
        <AvatarNameLabel
          layout="vertical"
          fullName="Mary Jane Watson"
          meta="Reservoir Geoscientist"
        />
      </div>
    </div>
  </div>
)
NameLabelEdgeCases.parameters = {
  docs: {
    description: {
      story:
        'The component fills its container. **Horizontal** layout is designed for narrow contexts like lists — long names truncate, emails wrap. **Vertical** layout keeps name and email on one line and is intended for wider contexts like headers or nav. Three-part names derive initials from first and last word (`"Mary Jane Watson"` → `"MW"`).',
    },
  },
}

export const NameLabelWithNotification: StoryFn = () => (
  <AvatarNameLabel
    fullName="Ada Lovelace"
    meta="Senior Engineer"
    notification
  />
)

export const NameLabelWithSlot: StoryFn = () => (
  <AvatarNameLabel fullName="Ada Lovelace" meta="Senior Engineer">
    <span aria-label="Settings" role="img">
      ⚙
    </span>
  </AvatarNameLabel>
)
NameLabelWithSlot.parameters = {
  docs: {
    description: {
      story: 'The `children` prop renders into the trailing slot.',
    },
  },
}
