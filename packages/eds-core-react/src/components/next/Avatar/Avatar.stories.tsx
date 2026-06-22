import type { Meta, StoryFn } from '@storybook/react-vite'
import { Avatar, type AvatarProps } from '.'
import { AvatarNameLabel, type AvatarNameLabelProps } from '.'

const meta: Meta<typeof Avatar> = {
  title: 'EDS 2.0 (beta)/Data Display/Avatar',
  component: Avatar,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** — this component is under active development.

Displays a user's initial in a circular badge. Use \`AvatarNameLabel\` to pair it with a name and email.

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
  initial: 'A',
  size: 'lg',
  emphasis: 'low',
  notification: false,
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
  email: 'ada@equinor.com',
  layout: 'horizontal',
}
NameLabelHorizontal.parameters = {
  docs: {
    description: {
      story:
        'Horizontal layout stacks the name and email vertically beside the avatar.',
    },
  },
}

export const NameLabelVertical: StoryFn<AvatarNameLabelProps> = (args) => (
  <AvatarNameLabel {...args} />
)
NameLabelVertical.args = {
  fullName: 'Ada Lovelace',
  email: 'ada@equinor.com',
  layout: 'vertical',
}
NameLabelVertical.parameters = {
  docs: {
    description: {
      story:
        'Vertical layout places the name and email on the same line — compact for use in dense lists.',
    },
  },
}

export const NameLabelWithNotification: StoryFn = () => (
  <AvatarNameLabel
    fullName="Ada Lovelace"
    email="ada@equinor.com"
    notification
  />
)

export const NameLabelWithSlot: StoryFn = () => (
  <AvatarNameLabel fullName="Ada Lovelace" email="ada@equinor.com">
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
