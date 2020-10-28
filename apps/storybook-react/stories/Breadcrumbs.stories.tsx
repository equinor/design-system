import React from 'react'
import styled from 'styled-components'
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Typography,
} from '@equinor/eds-core-react'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'

const { Breadcrumb } = Breadcrumbs

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
  grid-gap: 8px;
`

const TextWrapper = styled.div`
  margin: 18px 0;
`

const WrapContainer = styled.div`
  width: 100px;
`

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: {
    Breadcrumb,
  },
} as Meta

const handleClick = (e) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  action('handleClick')(e.target.textContent)
}

export const Default: Story<BreadcrumbsProps> = (args) => {
  return (
    <Body>
      <Breadcrumbs {...args}>
        <Breadcrumb>Label One</Breadcrumb>
        <Breadcrumb>Label Two</Breadcrumb>
        <Breadcrumb>Label Three</Breadcrumb>
        <Breadcrumb>Label Four</Breadcrumb>
        <Breadcrumb>Label Five</Breadcrumb>
      </Breadcrumbs>
    </Body>
  )
}

export const Variations: Story<BreadcrumbsProps> = () => {
  return (
    <Body>
      <TextWrapper>
        <Typography variant="h2">Normal</Typography>
      </TextWrapper>
      <Breadcrumbs>
        <Breadcrumb onClick={handleClick}>Store</Breadcrumb>
        <Breadcrumb onClick={handleClick}>Fruits</Breadcrumb>
        <Breadcrumb onClick={handleClick} aria-current="page">
          Apple
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Collapsed</Typography>
        <Typography variant="body_long">
          Choose collapse prop to use ellipses to indicate the middle pages.
          Click ellipses (...) to expand.
        </Typography>
      </TextWrapper>
      <Breadcrumbs collapse>
        <Breadcrumb onClick={handleClick}>Store</Breadcrumb>
        <Breadcrumb onClick={handleClick}>Fruits</Breadcrumb>
        <Breadcrumb onClick={handleClick}>Apple</Breadcrumb>
        <Breadcrumb onClick={handleClick} aria-current="page">
          Apple Juice
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Truncated labels</Typography>
        <Typography variant="body_long">
          Choose maxWidth in pixels to truncate labels. Hover on label to see
          full text.
        </Typography>
      </TextWrapper>
      <Breadcrumbs>
        <Breadcrumb maxWidth={30} onClick={handleClick}>
          Store
        </Breadcrumb>
        <Breadcrumb maxWidth={30} onClick={handleClick}>
          Fruits
        </Breadcrumb>
        <Breadcrumb maxWidth={30} onClick={handleClick} aria-current="page">
          Apple
        </Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Wrapped</Typography>
        <Typography variant="body_long">
          Wraps over two or more lines. Controlled by parent width.
        </Typography>
      </TextWrapper>
      <WrapContainer>
        <Breadcrumbs>
          <Breadcrumb onClick={handleClick}>Store</Breadcrumb>
          <Breadcrumb onClick={handleClick}>Fruits</Breadcrumb>
          <Breadcrumb onClick={handleClick} aria-current="page">
            Apple
          </Breadcrumb>
        </Breadcrumbs>
      </WrapContainer>
    </Body>
  )
}
