import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from '.'

const meta: Meta<typeof Search> = {
  title: 'EDS 2.0 (beta)/Search',
  component: Search,
  tags: ['beta'],
  args: {
    disabled: false,
    invalid: false,
    readOnly: false,
  },
  argTypes: {
    // Label
    label: {
      control: 'text',
      description: 'Label text for the field',
      table: { category: 'Label' },
    },

    // Content
    description: {
      control: 'text',
      description: 'Descriptive text displayed below the label',
      table: { category: 'Content' },
    },
    helperMessage: {
      control: 'text',
      description: 'Helper or validation message shown below the input',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when input is empty',
      table: { category: 'Content' },
    },

    // States
    invalid: {
      control: 'boolean',
      description:
        'Shows error styling. Use helperMessage to explain the error.',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables input interaction',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes input read-only (visible but not editable)',
      table: { category: 'States', defaultValue: { summary: 'false' } },
    },
    // Callbacks
    onClear: {
      control: false,
      description:
        'Callback fired when the clear button is clicked. Required in controlled mode to reset the value.',
      table: { category: 'Callbacks' },
    },
    onChange: {
      control: false,
      description: 'Callback fired on input change',
      table: { category: 'Callbacks' },
    },

    // Other
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: { category: 'Other' },
    },
    containerClassName: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Search } from '@equinor/eds-core-react/next'
\`\`\`

A search input with a built-in clear button that appears when the field has a value.
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

export const WithClearButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Type in the field to see the clear button appear. Click it to reset.',
      },
    },
  },
  render: () => (
    <Search label="Search" placeholder="Search" defaultValue="Equinor" />
  ),
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In controlled mode, use `value`, `onChange`, and `onClear` together. The clear button calls `onClear` — the parent is responsible for resetting the value.',
      },
    },
  },
  render: () => {
    const [value, setValue] = useState('Equinor')
    return (
      <Search
        label="Search"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        helperMessage={value ? `Searching for "${value}"` : undefined}
      />
    )
  },
}

export const WithoutLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Search can be used without a label for compact contexts like headers or toolbars. Always provide an `aria-label` for accessibility.',
      },
    },
  },
  render: () => (
    <Search placeholder="Search resources..." aria-label="Search resources" />
  ),
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
  parameters: {
    docs: {
      description: {
        story:
          'Use `helperMessage` to explain the error — there is no error icon in the search field by design.',
      },
    },
  },
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
