import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from '.'
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

type Story = StoryObj<typeof Link>

export const Introduction: Story = {
  args: {
    href: '#',
    children: 'Link',
  },
}

export const Inline: Story = {
  render: () => (
    <p>
      This is a paragraph with an <Link href="#">inline link</Link> embedded in
      text.
    </p>
  ),
}

export const Standalone: Story = {
  render: () => (
    <Link href="#" variant="standalone">
      Standalone link
    </Link>
  ),
}

export const WithIcons: Story = {
  render: () => (
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
  ),
}
