import React from 'react'
import { Pagination, PaginationProps, Typography } from '@components'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'

const PaddedTypography = styled(Typography)`
  margin: 16px 0;
`

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

export const Default: Story<PaginationProps> = (args) => {
  return <Pagination {...args} />
}

export const Variants: Story<PaginationProps> = () => {
  return (
    <>
      <PaddedTypography variant="h2">Length before truncation</PaddedTypography>
      <Pagination totalItems={7} itemsPerPage={1} />
      <PaddedTypography variant="h2">Truncated</PaddedTypography>
      <Pagination totalItems={8} itemsPerPage={1} />
      <PaddedTypography variant="h2">
        With current and total items indicator
      </PaddedTypography>
      <Pagination totalItems={140} itemsPerPage={3} withItemIndicator />
      <PaddedTypography variant="h2">Default page</PaddedTypography>
      <Pagination
        totalItems={140}
        itemsPerPage={3}
        withItemIndicator
        defaultPage={6}
      />
    </>
  )
}
