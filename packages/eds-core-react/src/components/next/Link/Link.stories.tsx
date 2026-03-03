import type { Meta, StoryFn } from '@storybook/react-vite'
import { Link, type LinkProps } from '.'
import { Icon } from '../Icon'
import { external_link, arrow_forward } from '@equinor/eds-icons'

const meta: Meta<typeof Link> = {
  title: 'EDS 2.0 (beta)/Link',
  component: Link,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Link } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<LinkProps> = (args) => {
  return (
    <Link href="#" {...args}>
      Link
    </Link>
  )
}

export const Inline: StoryFn<LinkProps> = () => {
  return (
    <p>
      This is a paragraph with an <Link href="#">inline link</Link> embedded in
      text.
    </p>
  )
}

export const Standalone: StoryFn<LinkProps> = () => {
  return (
    <Link href="#" variant="standalone">
      Standalone link
    </Link>
  )
}

export const WithIcons: StoryFn<LinkProps> = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      <Link href="#" variant="standalone">
        <Icon data={arrow_forward} />
        Link with start icon
      </Link>
      <Link href="#" variant="standalone">
        Link with end icon
        <Icon data={external_link} />
      </Link>
      <Link href="#" variant="standalone">
        <Icon data={arrow_forward} />
        Link with both icons
        <Icon data={external_link} />
      </Link>
    </div>
  )
}
