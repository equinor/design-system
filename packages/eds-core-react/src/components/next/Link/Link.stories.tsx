import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from '.'
import { Icon } from '../Icon'
import { external_link, arrow_forward } from '@equinor/eds-icons'
import page from './Link.docs.mdx'

const meta: Meta<typeof Link> = {
  title: 'EDS 2.0 (beta)/Navigation/Link',
  component: Link,
  tags: ['beta'],
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      // A click on a link that would open in the same tab is stopped, so the
      // docs page does not reload. A link that opens a new tab leaves the page
      // where it is, so it is left alone, and so is a click with Cmd or Ctrl
      // held, which the browser opens in a new tab. Decorators are left out of
      // the code shown on the docs page.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={(event) => {
          const link = (event.target as HTMLElement).closest('a')
          if (
            link &&
            link.target !== '_blank' &&
            !event.metaKey &&
            !event.ctrlKey
          ) {
            event.preventDefault()
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Link>

export const Introduction: Story = {
  args: {
    href: 'https://eds.equinor.com/docs/Next/components/navigation/link',
    target: '_blank',
    rel: 'noreferrer',
    children: 'Link',
  },
}

export const Overview: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      <p style={{ margin: 0 }}>
        Read the{' '}
        <Link href="https://github.com/equinor/design-system/releases">
          release notes
        </Link>{' '}
        before you upgrade.
      </p>
      <Link href="https://eds.equinor.com" variant="standalone">
        Open the documentation
      </Link>
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <p>
      This is a paragraph with an{' '}
      <Link href="https://eds.equinor.com">inline link</Link> embedded in text.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the inline variant inside a sentence. It takes the font size of the text around it.',
      },
    },
  },
}

export const Standalone: Story = {
  render: () => (
    <Link href="https://eds.equinor.com" variant="standalone">
      Standalone link
    </Link>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the standalone variant on its own, outside running text. It sets its own font and layout.',
      },
    },
  },
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
      <Link href="https://eds.equinor.com" variant="standalone">
        <Icon data={arrow_forward} />
        Link with start icon
      </Link>
      <Link href="https://eds.equinor.com" variant="standalone">
        Link with end icon
        <Icon data={external_link} />
      </Link>
      <Link href="https://eds.equinor.com" variant="standalone">
        <Icon data={arrow_forward} />
        Link with both icons
        <Icon data={external_link} />
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Place an `Icon` before the text, after it or on both sides of a standalone link.',
      },
    },
  },
}

export const AsChild: Story = {
  render: () => {
    const CustomLink = (
      props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ) => (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a {...props} data-custom-router />
    )
    return (
      <Link asChild>
        <CustomLink href="/my-page">Router link</CustomLink>
      </Link>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `asChild` to render Link styles on a router link or another component that renders an `<a>`.',
      },
    },
  },
}

export const ExternalLink: Story = {
  render: () => (
    <Link
      href="https://eds.equinor.com"
      variant="standalone"
      target="_blank"
      rel="noreferrer"
    >
      External link
      <Icon data={external_link} />
    </Link>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'For a link that leaves the site, set `target="_blank"` and `rel="noreferrer"`, and add an icon so the destination is clear.',
      },
    },
  },
}
