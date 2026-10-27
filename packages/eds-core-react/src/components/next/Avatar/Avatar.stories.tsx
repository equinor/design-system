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
        'Override the auto-derived initial(s). 1 or 2 characters recommended.',
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
      description:
        'Size of the avatar: sm (20px), md (24px), lg (32px) at comfortable density. Follows `data-density`.',
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
      description: 'Show a red notification dot.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
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
        'Pass `name` to make the avatar accessible. Initials are derived automatically and the avatar is announced to screen readers as `role="img"`. Without `name`, the initial is purely decorative. Inside `AvatarNameLabel` this is handled automatically from `name`.',
    },
  },
}

export const Overview: StoryFn = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Ada Lovelace" emphasis="high" />
      <Avatar
        name="Ada Lovelace"
        src="https://i.pravatar.cc/150?img=47"
        notification
      />
    </div>
    <AvatarNameLabel name="Ada Lovelace" meta="Senior Engineer" />
  </div>
)

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
      story:
        'Three sizes: `sm` (20px), `md` (24px), `lg` (32px) at comfortable density. The sizes follow `data-density`, like other components; see the density story.',
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
        'The `notification` prop adds a red notification dot at the bottom-right corner.',
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
        'Pass `src` to show a profile photo instead of initials. The image fills the circle with `object-fit: cover`. Use `name` for the accessible label. It becomes the `alt` text on the image.',
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
    description:
      'Secondary label, such as an email, a job title or any short metadata.',
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
      'Alt text for the photo. Defaults to empty, so the photo is decorative and the visible name is not announced twice.',
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
        'Vertical layout places the name and metadata on the same line, for wider contexts like headers or nav.',
    },
  },
}

export const NameLabelWithNotification: StoryFn = () => (
  <AvatarNameLabel name="Ada Lovelace" meta="Senior Engineer" notification />
)
NameLabelWithNotification.parameters = {
  docs: {
    description: {
      story:
        'The notification dot also works inside `AvatarNameLabel`. The avatar is decorative there, so the notification is read out through visually hidden text.',
    },
  },
}

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
        Vertical, for wider contexts (name and metadata on one line)
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
        'The component fills its container. In **horizontal** layout long names wrap and the row grows with the content. **Vertical** layout keeps name and metadata on one line, truncated with an ellipsis, and is intended for wider contexts like headers or nav. Initials are always derived from the **first and last word**, regardless of how many names: `"Mary Jane Elizabeth Watson"` gives `"MW"`.',
    },
  },
}

const densities = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable (default)' },
  { value: 'relaxed', label: 'Relaxed' },
]

export const NameLabelDensity: StoryFn = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'var(--eds-font-family-ui)',
    }}
  >
    {densities.map(({ value, label }) => (
      <div key={value} data-density={value}>
        <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '14px' }}>
          {label}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar initial="A" size="sm" />
            <Avatar initial="A" size="md" />
            <Avatar initial="A" size="lg" />
          </div>
          <AvatarNameLabel name="Ada Lovelace" meta="Senior Engineer" />
          <AvatarNameLabel
            name="Ada Lovelace"
            meta="Senior Engineer"
            layout="vertical"
          />
        </div>
      </div>
    ))}
  </div>
)
NameLabelDensity.parameters = {
  docs: {
    description: {
      story:
        'Avatar and `AvatarNameLabel` follow `data-density` on an ancestor, like other components. The avatar size, the gaps and the text size all come from tokens that change per density.',
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
            <Button variant="ghost" size="small" icon aria-label="More options">
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
                fontSize: 'var(--eds-typography-label-xs-font-size)',
                color: 'var(--eds-text-secondary)',
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
        'The `children` prop renders into a trailing slot to the right of the name. It is open, so use it for anything contextual to that person, like an action button, a role badge, or a timestamp. The examples here are just starting points.',
    },
  },
}
