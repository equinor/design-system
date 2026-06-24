import figma from '@figma/code-connect'
import { Avatar, AvatarNameLabel } from '.'

figma.connect(
  Avatar,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%94%B9-EDS-Core-Components?node-id=9319-5410',
  {
    props: {
      size: figma.enum('Size', {
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      }),
      emphasis: figma.enum('Emphasis', {
        High: 'high',
        Low: 'low',
      }),
      isPhoto: figma.enum('Variant', { Photo: true }),
      initial: figma.string('Initial'),
      notification: figma.boolean('Notification'),
    },
    example: ({ size, emphasis, isPhoto, initial, notification }) =>
      isPhoto ? (
        <Avatar
          size={size}
          src="https://i.pravatar.cc/150"
          notification={notification}
        />
      ) : (
        <Avatar
          size={size}
          emphasis={emphasis}
          initial={initial}
          notification={notification}
        />
      ),
  },
)

figma.connect(
  AvatarNameLabel,
  'https://www.figma.com/design/dz0XQdc5j7AAtjXr1gTfVR/%F0%9F%94%B9-EDS-Core-Components?node-id=9319-5429',
  {
    props: {
      name: figma.string('Full Name'),
      meta: figma.string('Email'),
      layout: figma.enum('Layout', {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      }),
      size: figma.enum('Size', {
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      }),
      emphasis: figma.enum('Emphasis', {
        High: 'high',
        Low: 'low',
      }),
      notification: figma.boolean('Notification'),
    },
    example: ({ name, meta, layout, size, emphasis, notification }) => (
      <AvatarNameLabel
        name={name}
        meta={meta}
        layout={layout}
        size={size}
        emphasis={emphasis}
        notification={notification}
      />
    ),
  },
)
