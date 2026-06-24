import React from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { more_vertical } from '@equinor/eds-icons'
import { Button } from '../Button'
import { Badge } from '../Badge'
import { Divider } from '../Divider'
import { Icon } from '../Icon'
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
  argTypes: {
    name: {
      control: 'text',
      description:
        'Full name of the person. Auto-derives initials and sets role="img" + aria-label for screen readers.',
      table: { category: 'Core' },
    },
    initial: {
      control: 'text',
      description:
        'Override the auto-derived initial(s). 1–2 characters recommended.',
      table: { category: 'Core' },
    },
    src: {
      control: 'text',
      description:
        'Profile photo URL. When provided, renders a circular photo instead of initials.',
      table: { category: 'Appearance' },
    },
    alt: {
      control: 'text',
      description:
        'Alt text for the photo. Falls back to `name` if not provided.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar — sm (16px), md (24px), lg (32px).',
      table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
    },
    emphasis: {
      control: 'inline-radio',
      options: ['low', 'high'],
      description:
        'low uses the muted accent background; high uses the emphasis background with white text.',
      table: { category: 'Appearance', defaultValue: { summary: 'low' } },
    },
    notification: {
      control: 'boolean',
      description: 'Show a success-tone notification indicator dot.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
  },
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
        'Pass `name` to make the avatar accessible — initials are derived automatically and the avatar is announced to screen readers as `role="img"`. Without `name`, the initial is purely decorative. Inside `AvatarNameLabel` this is handled automatically from `name`.',
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

export const Photo: StoryFn = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <Avatar
      src="https://i.pravatar.cc/150?img=47"
      name="Ada Lovelace"
      size="sm"
    />
    <Avatar
      src="https://i.pravatar.cc/150?img=47"
      name="Ada Lovelace"
      size="md"
    />
    <Avatar
      src="https://i.pravatar.cc/150?img=47"
      name="Ada Lovelace"
      size="lg"
    />
    <Avatar
      src="https://i.pravatar.cc/150?img=47"
      name="Ada Lovelace"
      size="lg"
      notification
    />
  </div>
)
Photo.parameters = {
  docs: {
    description: {
      story:
        'Pass `src` to show a profile photo instead of initials. The image fills the circle with `object-fit: cover`. Use `name` for the accessible label — it becomes the `alt` text on the image.',
    },
  },
}

export const NameLabelHorizontal: StoryFn<AvatarNameLabelProps> = (args) => (
  <AvatarNameLabel {...args} />
)
NameLabelHorizontal.args = {
  name: 'Ada Lovelace',
  meta: 'Senior Engineer',
  layout: 'horizontal',
}
NameLabelHorizontal.argTypes = {
  name: {
    control: 'text',
    description: 'Full name of the person.',
    table: { category: 'Core' },
  },
  meta: {
    control: 'text',
    description: 'Secondary label — email, job title, or any short metadata.',
    table: { category: 'Core' },
  },
  initial: {
    control: 'text',
    description: 'Override the auto-derived initial(s).',
    table: { category: 'Core' },
  },
  src: {
    control: 'text',
    description:
      'Profile photo URL. When provided, renders a circular photo instead of initials.',
    table: { category: 'Appearance' },
  },
  alt: {
    control: 'text',
    description:
      'Alt text for the photo. Falls back to `name` if not provided.',
    table: { category: 'Appearance' },
  },
  layout: {
    control: 'inline-radio',
    options: ['horizontal', 'vertical'],
    description: 'Layout of the name and metadata.',
    table: { category: 'Appearance', defaultValue: { summary: 'horizontal' } },
  },
  size: {
    control: 'inline-radio',
    options: ['sm', 'md', 'lg'],
    description: 'Size of the avatar.',
    table: { category: 'Appearance', defaultValue: { summary: 'lg' } },
  },
  emphasis: {
    control: 'inline-radio',
    options: ['low', 'high'],
    description: 'Colour emphasis of the avatar.',
    table: { category: 'Appearance', defaultValue: { summary: 'low' } },
  },
  notification: {
    control: 'boolean',
    description: 'Show a notification dot on the avatar.',
    table: { category: 'States', defaultValue: { summary: 'false' } },
  },
  children: {
    table: { disable: true },
  },
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
  name: 'Ada Lovelace',
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

export const NameLabelWithNotification: StoryFn = () => (
  <AvatarNameLabel name="Ada Lovelace" meta="Senior Engineer" notification />
)

export const NameLabelWithPhoto: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <AvatarNameLabel
      name="Ada Lovelace"
      meta="Senior Engineer"
      src="https://i.pravatar.cc/150?img=47"
    />
    <AvatarNameLabel
      name="Ada Lovelace"
      meta="Senior Engineer"
      src="https://i.pravatar.cc/150?img=47"
      layout="vertical"
    />
    <AvatarNameLabel
      name="Ada Lovelace"
      meta="Senior Engineer"
      src="https://i.pravatar.cc/150?img=47"
      notification
    />
  </div>
)
NameLabelWithPhoto.parameters = {
  docs: {
    description: {
      story:
        'Pass `src` to show a profile photo in the avatar. Works with both layouts and the notification dot.',
    },
  },
}

export const NameLabelEdgeCases: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6f6f6f' }}>
        Horizontal (default)
      </p>
      <ListWithDividers maxWidth="200px">
        {[
          {
            name: 'Bartholomew Featherstonehaugh',
            meta: 'b.featherstonehaugh@equinor.com',
          },
          {
            name: 'Mary Jane Elizabeth Watson',
            meta: 'mary.watson@equinor.com',
          },
        ].map(({ name, meta }) => (
          <AvatarNameLabel key={name} name={name} meta={meta} />
        ))}
      </ListWithDividers>
    </div>
    <div>
      <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6f6f6f' }}>
        Vertical — designed for wider contexts (name + metadata on one line)
      </p>
      <ListWithDividers>
        {[
          {
            name: 'Bartholomew Featherstonehaugh',
            meta: 'b.featherstonehaugh@equinor.com',
          },
          {
            name: 'Mary Jane Elizabeth Watson',
            meta: 'mary.watson@equinor.com',
          },
        ].map(({ name, meta }) => (
          <AvatarNameLabel
            key={name}
            layout="vertical"
            name={name}
            meta={meta}
          />
        ))}
      </ListWithDividers>
    </div>
  </div>
)
NameLabelEdgeCases.parameters = {
  docs: {
    description: {
      story:
        'The component fills its container. Long names wrap naturally — the row height grows with the content. **Vertical** layout keeps name and metadata on one line and is intended for wider contexts like headers or nav. Initials are always derived from the **first and last word**, regardless of how many names — `"Mary Jane Elizabeth Watson"` → `"MW"`.',
    },
  },
}

const sectionLabel = { fontSize: '11px', color: '#6f6f6f', marginBottom: '4px' }

const ListWithDividers = ({
  children,
  maxWidth = '320px',
}: {
  children: React.ReactNode[]
  maxWidth?: string
}) => {
  const items = React.Children.toArray(children)
  return (
    <div style={{ maxWidth }}>
      {items.map((child, i) => (
        <div key={(child as React.ReactElement).key}>
          <div style={{ padding: '8px 0' }}>{child}</div>
          {i < items.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  )
}

export const NameLabelWithSlot: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <p style={sectionLabel}>Overflow menu</p>
      <ListWithDividers>
        {[
          {
            name: 'Ada Lovelace',
            meta: 'Senior Engineer',
            img: 'https://i.pravatar.cc/150?img=47',
          },
          {
            name: 'Mary Jane Watson',
            meta: 'Reservoir Geoscientist',
            img: 'https://i.pravatar.cc/150?img=32',
          },
        ].map(({ name, meta, img }) => (
          <AvatarNameLabel key={name} name={name} meta={meta} src={img}>
            <Button variant="ghost" size="sm" aria-label="More options">
              <Icon data={more_vertical} />
            </Button>
          </AvatarNameLabel>
        ))}
      </ListWithDividers>
    </div>

    <div>
      <p style={sectionLabel}>Role badge</p>
      <ListWithDividers>
        {[
          {
            name: 'Ada Lovelace',
            meta: 'ada@equinor.com',
            role: 'Admin',
            tone: 'info' as const,
            img: 'https://i.pravatar.cc/150?img=47',
          },
          {
            name: 'Mary Jane Watson',
            meta: 'mary@equinor.com',
            role: 'Viewer',
            tone: 'neutral' as const,
            img: 'https://i.pravatar.cc/150?img=32',
          },
        ].map(({ name, meta, role, tone, img }) => (
          <AvatarNameLabel key={name} name={name} meta={meta} src={img}>
            <Badge tone={tone}>{role}</Badge>
          </AvatarNameLabel>
        ))}
      </ListWithDividers>
    </div>

    <div>
      <p style={sectionLabel}>Last active</p>
      <ListWithDividers>
        {[
          {
            name: 'Ada Lovelace',
            meta: 'Senior Engineer',
            time: '2h ago',
            img: 'https://i.pravatar.cc/150?img=47',
          },
          {
            name: 'Mary Jane Watson',
            meta: 'Reservoir Geoscientist',
            time: '3d ago',
            img: 'https://i.pravatar.cc/150?img=32',
          },
        ].map(({ name, meta, time, img }) => (
          <AvatarNameLabel key={name} name={name} meta={meta} src={img}>
            <span
              style={{
                fontSize: 'var(--eds-typography-ui-body-xs-font-size)',
                color: 'var(--eds-color-text-subtle)',
                whiteSpace: 'nowrap',
              }}
            >
              {time}
            </span>
          </AvatarNameLabel>
        ))}
      </ListWithDividers>
    </div>
  </div>
)
NameLabelWithSlot.parameters = {
  docs: {
    description: {
      story:
        'The `children` prop renders into a trailing slot to the right of the name. It is open — use it for anything contextual to that person, like an action button, a role badge, or a timestamp. The examples here are just starting points.',
    },
  },
}
