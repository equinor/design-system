import React from 'react'
import { Pagination, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { withKnobs, number, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

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
  title: 'Components|Pagination',
  component: Pagination,
  decorators: [withKnobs],
}

export const Variants = () => {
  return (
    <Body>
      <PaddedTypography variant="h2">Short</PaddedTypography>
      <Pagination totalItems={3} itemsPerPage={1} />
      <PaddedTypography variant="h2">
        Normal length before truncation
      </PaddedTypography>
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

      {/* TODO: Example with dropdown component */}
    </Body>
  )
}

export const WithKnobs = () => {
  const totalItems = number('Total Items', 20)
  const itemsPerPage = number('Items per page', 1)
  const withItemIndicator = boolean('With item indicator', true)
  const defaultPage = number('Default page', 5)
  return (
    <Body>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        withItemIndicator={withItemIndicator}
        defaultPage={defaultPage}
      />
    </Body>
  )
}
