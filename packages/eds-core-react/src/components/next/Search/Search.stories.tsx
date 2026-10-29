import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from '.'
import page from './Search.docs.mdx'

const meta: Meta<typeof Search> = {
  title: 'EDS 2.0 (beta)/Inputs/Search',
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
    clearLabel: {
      control: 'text',
      description:
        'Accessible label for the clear button. Override for localisation.',
      table: { category: 'Other', defaultValue: { summary: 'Clear search' } },
    },
    id: {
      control: 'text',
      description:
        'Unique identifier for the field (auto-generated if not provided)',
      table: { category: 'Other' },
    },
    className: {
      control: 'text',
      description:
        'CSS class names applied to the root element (the `<search>` wrapper). Use this to control layout, width, or margin of the entire search field.',
      table: { category: 'Styling' },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the root element (the `<search>` wrapper).',
      table: { category: 'Styling' },
    },
  },
  parameters: {
    docs: {
      page,
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

export const Overview: Story = {
  render: () => (
    <>
      <Search label="Search" placeholder="Search" />
      <Search label="Search" defaultValue="Equinor" />
    </>
  ),
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
          'In controlled mode, use `value`, `onChange` and `onClear` together. The clear button calls `onClear`, and the parent is responsible for resetting the value.',
      },
    },
  },
  render: function ControlledSearch() {
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
  parameters: {
    docs: {
      description: {
        story:
          'Use `description` for extra context about what the search covers.',
      },
    },
  },
  render: () => (
    <Search
      label="Search"
      description="Search across all resources"
      placeholder="Search"
    />
  ),
}

export const WithHelperMessage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `helperMessage` for a hint below the field, such as how many characters a search needs.',
      },
    },
  },
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
          'Use `helperMessage` to explain the error. There is no error icon in the search field by design.',
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
  parameters: {
    docs: {
      description: {
        story:
          'A disabled search cannot be focused or edited, and it shows no clear button.',
      },
    },
  },
  render: () => <Search label="Search" placeholder="Search" disabled />,
}

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A read only search keeps its value visible and focusable, but it cannot be edited and shows no clear button.',
      },
    },
  },
  render: () => (
    <Search label="Search" defaultValue="Previous search" readOnly />
  ),
}
