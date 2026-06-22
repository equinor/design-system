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
      initial: figma.string('Initial'),
      notification: figma.boolean('Notification'),
    },
    example: ({ size, emphasis, initial, notification }) => (
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
      fullName: figma.string('Full Name'),
      email: figma.string('Email'),
      layout: figma.enum('Layout', {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      }),
    },
    example: ({ fullName, email, layout }) => (
      <AvatarNameLabel fullName={fullName} email={email} layout={layout} />
    ),
  },
)
