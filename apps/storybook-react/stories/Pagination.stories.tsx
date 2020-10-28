import React from 'react'
import { Pagination, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, number, boolean } from '@storybook/addon-knobs'

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
  decorators: [withKnobs],
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

export const WithKnobs = () => {
  const totalItems = number('Total Items', 20)
  const itemsPerPage = number('Items per page', 1)
  const withItemIndicator = boolean('With item indicator', true)

  return (
    <Body>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        withItemIndicator={withItemIndicator}
      />
    </Body>
  )
}
