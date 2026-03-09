import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from '.'

const meta: Meta<typeof Search> = {
  title: 'EDS 2.0 (beta)/Search',
  component: Search,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Search } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Search>

export const Introduction: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search',
  },
}

export const WithDescription: Story = {
  render: () => (
    <Search
      label="Search"
      description="Search across all resources"
      placeholder="Search"
    />
  ),
}

export const WithHelperMessage: Story = {
  render: () => (
    <Search
      label="Search"
      placeholder="Search"
      helperMessage="Enter at least 3 characters"
    />
  ),
}

export const Invalid: Story = {
  render: () => (
    <Search
      label="Search"
      placeholder="Search"
      invalid
      helperMessage="No results found"
    />
  ),
}

export const Disabled: Story = {
  render: () => <Search label="Search" placeholder="Search" disabled />,
}

export const ReadOnly: Story = {
  render: () => (
    <Search label="Search" defaultValue="Previous search" readOnly />
  ),
}
