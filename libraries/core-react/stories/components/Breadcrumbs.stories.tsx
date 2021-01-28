import React from 'react'
import styled from 'styled-components'
import { Breadcrumbs, BreadcrumbsProps, Typography } from '@components'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'

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
    Breadcrumb: Breadcrumbs.Breadcrumb,
  },
  parameters: {
    docs: {
      description: {
        component: `Breadcrumbs show the navigational path to users allowing them to navigate up the hierarchy.
        `,
      },
    },
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
        <Breadcrumbs.Breadcrumb>Label One</Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb>Label Two</Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb>Label Three</Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb>Label Four</Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb>Label Five</Breadcrumbs.Breadcrumb>
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
        <Breadcrumbs.Breadcrumb onClick={handleClick}>
          Store
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb onClick={handleClick}>
          Fruits
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb onClick={handleClick} aria-current="page">
          Apple
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Collapsed</Typography>
        <Typography variant="body_long">
          Choose collapse prop to use ellipses to indicate the middle pages.
          Click ellipses (...) to expand.
        </Typography>
      </TextWrapper>
      <Breadcrumbs collapse>
        <Breadcrumbs.Breadcrumb onClick={handleClick}>
          Store
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb onClick={handleClick}>
          Fruits
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb onClick={handleClick}>
          Apple
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb onClick={handleClick} aria-current="page">
          Apple Juice
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Truncated labels</Typography>
        <Typography variant="body_long">
          Choose maxWidth in pixels to truncate labels. Hover on label to see
          full text.
        </Typography>
      </TextWrapper>
      <Breadcrumbs>
        <Breadcrumbs.Breadcrumb maxWidth={30} onClick={handleClick}>
          Store
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb maxWidth={30} onClick={handleClick}>
          Fruits
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb
          maxWidth={30}
          onClick={handleClick}
          aria-current="page"
        >
          Apple
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
      <TextWrapper>
        <Typography variant="h2">Wrapped</Typography>
        <Typography variant="body_long">
          Wraps over two or more lines. Controlled by parent width.
        </Typography>
      </TextWrapper>
      <WrapContainer>
        <Breadcrumbs>
          <Breadcrumbs.Breadcrumb onClick={handleClick}>
            Store
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb onClick={handleClick}>
            Fruits
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb onClick={handleClick} aria-current="page">
            Apple
          </Breadcrumbs.Breadcrumb>
        </Breadcrumbs>
      </WrapContainer>
    </Body>
  )
}
