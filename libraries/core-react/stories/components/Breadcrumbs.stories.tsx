import React from 'react'
import styled from 'styled-components'
import { Breadcrumbs, BreadcrumbsProps } from '@components'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
  grid-gap: 8px;
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
  e.preventDefault()
}

export const Default: Story<BreadcrumbsProps> = (args) => {
  return (
    <Body>
      <Breadcrumbs {...args}>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label One
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Two
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Three
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Four
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Five
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
    </Body>
  )
}

export const Normal: Story<BreadcrumbsProps> = () => (
  <Body>
    <Breadcrumbs>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Store
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Fruits
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Body>
)

export const Collapsed: Story<BreadcrumbsProps> = () => (
  <Body>
    <Breadcrumbs collapse>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Store
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Fruits
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Apple
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple Juice
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Body>
)

Collapsed.parameters = {
  docs: {
    storyDescription: `Choose collapse prop to use ellipses to indicate the middle pages.
    Click ellipses (...) to expand.`,
  },
}

export const TruncatedLabels: Story<BreadcrumbsProps> = () => (
  <Body>
    <Breadcrumbs>
      <Breadcrumbs.Breadcrumb href="#" maxWidth={30} onClick={handleClick}>
        Store
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" maxWidth={30} onClick={handleClick}>
        Fruits
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb
        maxWidth={30}
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Body>
)
TruncatedLabels.parameters = {
  docs: {
    storyDescription: `Choose maxWidth in pixels to truncate labels. Hover on label to see
    full text.`,
  },
}
TruncatedLabels.storyName = 'Truncated labels'

export const Wrapped: Story<BreadcrumbsProps> = () => (
  <Body>
    <Breadcrumbs>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Store
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Fruits
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Body>
)
Wrapped.parameters = {
  docs: {
    storyDescription: `Wraps over two or more lines. Controlled by parent width.`,
  },
}
