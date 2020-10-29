import React from 'react'
import {
  Pagination,
  PaginationProps,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
  grid-gap: 8px;
  width: 750px;
`

const PaddedTypography = styled(Typography)`
  margin: 16px 0;
`

export default {
  title: 'Components/Pagination',
  component: Pagination,
  table: {
    defaultValue: {},
  },
  argTypes: {
    totalItems: {
      defaultValue: 40,
      control: {
        type: 'number',
        min: 40,
        max: 1000,
        step: 10,
      },
    },
  },
} as Meta

export const Default: Story<PaginationProps> = (args) => {
  return (
    <Body>
      <Pagination {...args} />
    </Body>
  )
}

export const Variants = () => {
  return (
    <Body>
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
    </Body>
  )
}
