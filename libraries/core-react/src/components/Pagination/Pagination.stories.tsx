import React from 'react'
import { Pagination, PaginationProps } from '../..'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Pagination allows long sets of data or content to be
        divided into multiple pages with controls to navigate between these pages.
        `,
      },
    },
  },
  argTypes: {
    totalItems: {
      defaultValue: 40,
      control: {
        type: 'number',
        min: 10,
        max: 1000,
        step: 1,
      },
    },
  },
} as Meta

export const Default: Story<PaginationProps> = (args) => (
  <Pagination {...args} />
)

export const Truncated: Story<PaginationProps> = () => (
  <Pagination totalItems={8} itemsPerPage={1} />
)

export const WithIndicator: Story<PaginationProps> = () => (
  <Pagination totalItems={140} itemsPerPage={3} withItemIndicator />
)
